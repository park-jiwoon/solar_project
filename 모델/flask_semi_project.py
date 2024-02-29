from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
from flask_cors import CORS
import numpy as np
import io

app = Flask(__name__)
CORS(app)

# 모델 로드
model = load_model('VGG16_model.h5')

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    if file:
        # FileStorage 인스턴스를 BytesIO로 변환
        byte_stream = io.BytesIO()
        file.save(byte_stream)
        byte_stream.seek(0) # Seek to the start of the stream

        img = image.load_img(byte_stream, target_size=(244, 244))
        img_array = image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0)
        
        predictions = model.predict(img_array)
        class_idx = np.argmax(predictions, axis=1)
        
        # 결과 반환 (class_names 리스트는 훈련 시의 클래스 이름 순서에 따라야 함)
        class_names = ['Cleaning', 'Exchange', 'Normal']  # 실제 클래스 이름으로 대체
        return jsonify({'prediction': class_names[class_idx[0]]})

if __name__ == '__main__':
    app.run(debug=True)
