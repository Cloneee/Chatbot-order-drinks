# -*- coding: utf-8 -*-
import json
from bson import json_util, ObjectId
import requests
from pprint import pprint
from bottle import debug, request, route, run
from bottle import response as resp
import random
from fuzzywuzzy import fuzz
import chatbot_response as cr
from pymongo import MongoClient
from datetime import datetime

# Setup Database
myclient = MongoClient("mongodb://localhost:27017/")
mydb = myclient["chatbot"]
mycol = mydb["order"]

# Setup facebook API
GRAPH_URL = "https://graph.facebook.com/v7.0"
PAGE_TOKEN = "Put your Facebook Token here"
img_response_links = ["https://i.pinimg.com/originals/6e/24/db/6e24db7e8d4d98939d65081fc50259ca.jpg"]

# the decorator
def enable_cors(fn):
    def _enable_cors(*args, **kwargs):
        # set CORS headers
        resp.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000'
        resp.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, OPTIONS'
        resp.headers['Access-Control-Allow-Headers'] = 'Origin, Accept, Content-Type, X-Requested-With, X-CSRF-Token'

        if request.method != 'OPTIONS':
            # actual request; reply with the actual response
            return fn(*args, **kwargs)

    return _enable_cors

# Load dishes data
with open("data/dishes_data.json", "r", encoding="utf-8") as json_data:
    database = json.load(json_data)

drink_topping = {}
for values in database.values():
    for value in values:
        drink_topping[value["name"]] = value["customs"]

# Setup user info
status_code = -1
user_info = {}
user_info['drink'] = []
user_info['topping'] = []
user_info['total_cost'] = 0


def send_to_messenger(ctx):
    url = "{0}/me/messages?access_token={1}".format(GRAPH_URL, PAGE_TOKEN)
    response = requests.post(url, json=ctx)

# def get_location(str):
#     print("Str: " + str)
# 	if (str != ""):
# 		return str
# 	return None

def create_all_drink_elements():
    all_drink_list = []
    idx = 0
    for values in database.values():
        for value in values:
            a_dict = {}
            a_dict["title"] = value["name"]
            a_dict["image_url"] = value["image"]
            a_dict["subtitle"] = "{}; Giá: {}Đ".format(
                value["description"], value["price"])
            a_dict["buttons"] = [
                {
                    "type": "postback",
                    "payload": "/order_drink_{}".format(value['id']),
                            "title": "Đặt hàng"
                }
            ]
            all_drink_list.append(a_dict)
            idx += 1
            if idx == 10:
                return all_drink_list
    return all_drink_list


def get_drink_value_by_payload(payload):
    for values in database.values():
        for value in values:
            if str(value['id']) == payload.split('_')[-1]:
                return value


def get_drink_value_by_name(name):
    for values in database.values():
        for value in values:
            if value['name'] == name:
                return value


def get_topping_value_by_drink_name_and_payload(drink_name, payload):
    topping_id = payload.split('_')[-1]
    value = get_drink_value_by_name(drink_name)
    for x in value["customs"][0]["customOptions"]:
        if str(x["id"]) == topping_id:
            return x


def create_all_topping_elements():
    all_topping_list = []
    idx = 0
    value = get_drink_value_by_name(user_info['drink'][-1])

    y = 0
    for x in value["customs"][0]["customOptions"]:
        a_dict = {}
        a_dict["title"] = x["value"]
        a_dict["subtitle"] = "Giá: {}Đ".format(x["price"])
        a_dict["buttons"] = [
            {
                "type": "postback",
                "payload": "/order_topping_{}_{}".format(value['id'], x['id']),
                        "title": "Đặt hàng"
            }
        ]
        all_topping_list.append(a_dict)
        y += 1
        if y == 10:
            return all_topping_list
    return all_topping_list


@route("/webhook", method=["GET", "POST"])
def bot_endpoint():
    if request.method.lower() == "get":
        # verify_token = request.GET.get("hub.verify_token")
        # print(verify_token)
        hub_challenge = request.GET.get("hub.challenge")
        url = "{0}/me/subscribed_apps?access_token={1}".format(
            GRAPH_URL, PAGE_TOKEN)
        response = requests.post(url)
        return hub_challenge
    else:
        global status_code
        global user_info
        body = json.loads(request.body.read())
        user_id = body["entry"][0]["messaging"][0]["sender"]["id"]
        page_id = body["entry"][0]["id"]
        ctx = {}
        if user_id != page_id:
            ctx["recipient"] = {"id": user_id}

        if "message" in body["entry"][0]["messaging"][0]:
            message = body["entry"][0]["messaging"][0]["message"]
            # sticker, image, gif
            if "attachments" in message:
                new_dict = {}
                new_dict["type"] = "image"
                random_link = random.choice(img_response_links)
                new_dict["payload"] = {"url": random_link}
                ctx["message"] = {"attachment": new_dict}
            # Regular text or icon
            elif "text" in message:
                text = message["text"]
                if status_code == -1:
                    tag, _ = cr.classify(text)
                    
                    if tag != "ask_drink" and tag != "order" and tag != "coupon" and tag != "payment":
                        ctx["message"] = {"text": cr.response(tag)}
                    elif tag == "coupon":
                        ctx["message"] = {"text": cr.response(tag)}
                        # Will extend in the future
                    elif tag == "payment":
                        small_ctx = ctx.copy()
                        small_ctx["message"] = {"text": cr.response(tag)}
                        response = send_to_messenger(small_ctx)

                        status_code = 0
                        ctx["message"] = {
                            "text": "Số điện thoại của bạn là: (Ví dụ: 0902210496, +84902210496,...)"}
                    else:
                        small_ctx = ctx.copy()
                        small_ctx["message"] = {"text": cr.response(tag)}
                        response = send_to_messenger(small_ctx)

                        new_dict = {}
                        new_dict["type"] = "template"
                        new_dict["payload"] = {
                            "template_type": "generic", "elements": create_all_drink_elements()}
                        ctx["message"] = {"attachment": new_dict}
                else:
                    if status_code == 0:
                        try:
                            phone = message['nlp']['entities']['wit$phone_number:phone_number'][0]['value']
                            user_info['phone'] = phone
                            status_code += 1
                            ctx["message"] = {
                                "text": "OK Mình đã ghi nhận số điện thoại của bạn. Tiếp theo cho mình xin thời gian bạn muốn nhận đồ nhé. (Ví dụ: 3 giờ chiều, 15:00,...)"}
                        except KeyError:
                            ctx["message"] = {
                                "text": "Số điện thoại của bạn là: (Ví dụ: 0902210496, +84902210496,...)"}
                    elif status_code == 1:
                        try:
                            date = message['nlp']['entities']['wit$datetime:datetime'][0]['value']
                            user_info['datetime'] = date
                            status_code += 1
                            ctx["message"] = {
                                "text": "Mình đã có thông tin về thời gian bạn muốn nhận đồ. Cuối cùng cho mình xin địa chỉ nhé. (Ví dụ: 295 Bạch Mai, Hai Bà Trưng, Hà Nội,...)"}
                        except KeyError:
                            ctx["message"] = {
                                "text": "Mình không biết bạn nhập mấy giờ luôn. Cho mình xin lại nhé!"}
                    elif status_code == 2:
                        try:
                            if (body["entry"][0]["messaging"][0]["sender"]["id"] != "103036932252302"):
                                user_info['fbid'] = body["entry"][0]["messaging"][0]["sender"]["id"]
                                location_value = text
                                if location_value != None:
                                    user_info['location'] = location_value
                                    drink_str = ''
                                    for i, drink in enumerate(user_info['drink']):
                                        topping = user_info['topping'][i]
                                        if topping != None:
                                            drink_str += ' - 1 ' + drink + ' với topping ' + topping + '\n'
                                        else:
                                            drink_str += ' - 1 ' + drink + '\n'

                                    status_code += 1
                                    ctx["message"] = {
                                    "text": "Mình tổng kết lại nhé:\n*Đồ uống:\n{}*Số điện thoại: {}\n*Giờ lấy đồ: {}\n*Địa chỉ bạn nhập: {}\n*Tổng tiền là {} nha.".format(
                                            drink_str, 
                                            user_info['phone'], 
                                            user_info['datetime'], 
                                            user_info['location'], 
                                            user_info['total_cost']
                                            )
                                    }
                                    user_info['createDate'] = str(datetime.now())
                                    user_info['status'] = 'Nhận đơn'
                                    mycol.insert_one(user_info)
                                    
                        except KeyError:
                            ctx["message"] = {
                                "text": "Địa chỉ lạ quá bạn ơi, bước cuối rồi cố nhập chuẩn nào."}
                    else:
                        user_info = {}
                        user_info['drink'] = []
                        user_info['topping'] = []
                        user_info['total_cost'] = 0
                        ctx["message"] = {
                            "text": "Cảm ơn bạn đã mua hàng. Chúng ta làm đơn hàng mới thôi nhể."}
                        status_code = -1
        # postback
        elif "postback" in body["entry"][0]["messaging"][0]:
            payload = body["entry"][0]["messaging"][0]["postback"]["payload"]

            if payload.startswith("/order_drink"):
                value = get_drink_value_by_payload(payload)
                user_info['drink'].append(value["name"])
                user_info['total_cost'] += value["price"]
                ctx["message"] = {
                    "attachment": {
                        "type": "template",
                        "payload": {
                            "template_type": "generic",
                            "elements": [
                                {
                                    "title": "Bạn có muốn dùng thêm topping không?",
                                    "buttons": [
                                        {
                                            "type": "postback",
                                            "payload": "/yes_topping",
                                            "title": "OK"
                                        },
                                        {
                                            "type": "postback",
                                            "payload": "/no_topping",
                                            "title": "Không nha"
                                        },
                                    ]
                                }
                            ]
                        }
                    }
                }
            elif payload.startswith("/no_topping"):
                user_info['topping'].append(None)
                ctx["message"] = {
                    "text": "OK. Bạn có thể gọi thêm đồ khác hoặc hú mình kiểu như \"Cho mình thanh toán cái\" để thanh toán nhé."}
            elif payload.startswith("/yes_topping"):
                small_ctx = ctx.copy()
                small_ctx["message"] = {"text": "Mời chọn topping ạ:"}
                response = send_to_messenger(small_ctx)
                new_dict = {}
                new_dict["type"] = "template"
                new_dict["payload"] = {
                    "template_type": "generic", "elements": create_all_topping_elements()}
                ctx["message"] = {"attachment": new_dict}
            elif payload.startswith("/order_topping"):
                value = get_topping_value_by_drink_name_and_payload(
                    user_info['drink'][-1], payload)
                user_info['topping'].append(value["value"])
                user_info['total_cost'] += value["price"]
                ctx["message"] = {
                    "text": "Lựa chọn tuyệt vời đấy. Giờ bạn có thể nói chuyện tiếp với mình, hoặc mua đồ mới hoặc lúc nào muốn tính tiền thì có thể kêu mình kiểu như \"Tính tiền cho mình với\" để mình chốt đơn nhé"}
        response = send_to_messenger(ctx)
        return ""

@route("/data", method=["GET", "POST", "OPTIONS"])
@enable_cors
def data():
    resp.content_type = 'application/json'
    data = [doc for doc in mycol.find()]  
    for x in range(0,len(data)):
        data[x]['_id'] = str(data[x]['_id'])
    return json.dumps({"data": data})

@route("/status", method=["POST", "OPTIONS"])
@enable_cors
def status():
    resp.content_type = 'application/json'
    _id = request.json['_id']
    status = request.json['status']
    mycol.update_one({"_id": ObjectId(_id)}, {"$set": {"status": status}})
    return json.dumps({"msg": "OK"})


@route("/auth/login", method=["GET", "POST", "OPTIONS"])
@enable_cors
def login():
    data = request.json
    if (data['username'] == "admin" and data['password'] == "123456"):
        resp.set_cookie('token', 'JWT_holder')
        return json.dumps({"token": "JWT_holder", "profile": {"username": "admin", "role": "admin"}})
    else:
        return json.dumps({"err": "Wrong password"})

debug(True)
run(reloader=True, port=8088)
