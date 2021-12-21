# Create folder "pkl" if not exist yet
from pathlib import Path
Path("./pkl").mkdir(parents=True, exist_ok=True)

# things we need for NLP
import nltk
from underthesea import word_tokenize
from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer
from keras.utils.np_utils import to_categorical
# things we need for Tensorflow
import numpy as np
import tensorflow as tf
import keras
from tensorflow import keras
from tensorflow.keras import layers
import random
import pickle
import json
import re

patterns = {
	'[àáảãạăắằẵặẳâầấậẫẩ]': 'a',
	'[đ]': 'd',
	'[èéẻẽẹêềếểễệ]': 'e',
	'[ìíỉĩị]': 'i',
	'[òóỏõọôồốổỗộơờớởỡợ]': 'o',
	'[ùúủũụưừứửữự]': 'u',
	'[ỳýỷỹỵ]': 'y'
}

stop_words = ['bạn', 'ban', 'anh', 'chị', 'chi', 'em', 'shop', 'bot', 'ad']

def convert_to_no_accents(text):
	output = text
	for regex, replace in patterns.items():
        #Re.sub() sẽ thay thế tất cả các kết quả khớp với regex có trong output bằng 
        #một nội dung replace
        #và trả về một kết quả, một chuỗi output mới đã được sửa đổi
        # Ví dụ: à á -> a
		output = re.sub(regex, replace, output)
        #Ví dụ: Â Ă -> A
		output = re.sub(regex.upper(), replace.upper(), output)
	return output

#Loading our JSON Data:
trains = {} #Để chứa các tag:patterns, ví dụ: {'greeting': [Hi, ...Hello], 'goodbye': ['Bye', ...'PP']}
with open('data/intents.json', 'r', encoding='utf-8') as json_data:
	intents = json.load(json_data) #Loading JSON
    #Chạy qua từng phần tử {...}, {...} trong JSON
	for one_intent in intents['intents']:
		sentences = one_intent['patterns'] #["Hi"...] trong {...} hiện tại
		trains[one_intent['tag']] = sentences #trains = { tag:patterns }
#print(trains) #In ra để tham khảo biến trains
classes = {} #Có dạng như sau: {0: 'greeting', 1: 'goodbye', 2: 'thanks'}
X_train = []
y_train = []
# Tại mỗi vị trí i của các phần tử tag thuộc dict trains
# Lấy ra ('greeting', ['Hi', 'How...,'Good day'])
# Hàm enumerate(trains.items()) có chức năng giúp đặt thêm số đếm i cho các tag:patterns
for i, (key, value) in enumerate(trains.items()):
    X_train += [word_tokenize(v, format="text") for v in value] + [convert_to_no_accents(v) for v in value]; #Một list chứa tất cả các cụm từ có trong pattern của các tag
    y_train += [i]*len(value)*2; #Tạo một List chứa size(pattern)*2 của của từng tag
    classes[i] = key #Hoàn thiện biến classes, là một dict chứa các key/số thứ tự : value/tag

pickle.dump(classes, open("pkl/classes.pkl", "wb")) #Mở file để ghi cho dạng nhị phân

y_train = to_categorical(y_train) #trả về một ma trận các giá trị nhị phân. Nó có số hàng bằng với độ dài của input vector & số cột bằng với số lượng các tag. Tại cột tương ứng, nếu có tồn tại sẽ có giá trị là 1, nếu không thì là 0.
#print(y_train)

vectorizer = TfidfVectorizer(lowercase=True, stop_words=stop_words)
#print(vectorizer)

# Lưu lại:
X_train = vectorizer.fit_transform(X_train).toarray()
#print(X_train)
#print('shape = ', X_train.shape[1:], ":", X_train.shape[:1])
pickle.dump(vectorizer, open("pkl/tfidf_vectorizer.pkl", "wb"))
#print(vectorizer)

# Model
model = tf.keras.Sequential()
model.add(tf.keras.layers.Dense(8, input_dim = X_train.shape[1] ))
model.add(tf.keras.layers.Dense(8))
model.add(tf.keras.layers.Dense(len(y_train[0]), activation='softmax'))
callbacks = [
	keras.callbacks.ModelCheckpoint('pkl/model.h5', save_best_only=True),
]
model.compile(loss='mean_squared_error', optimizer='adam')
model.fit(X_train, y_train, epochs=2000, batch_size=8, callbacks=callbacks)
model.save('pkl/model.h5')