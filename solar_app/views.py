from django.shortcuts import render

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from solar_app.models import Membership
from solar_app.models import Company
from solar_app.models import Register, Dividend
from django.shortcuts import get_object_or_404
import os
import json


# company 테이블 불러오기
# company 테이블 모든 레코드 조회하여 JSON 형식으로
# 클라이언트에 반환
def get_companies(request):
    # 모든 레코드 조회
    companies = list(Company.objects.values())
    # JSON 형식으로 리액트에 반환
    return JsonResponse(companies, safe=False)

def get_dividend(request):
    dividends = list(Dividend.objects.values())
    return JsonResponse(dividends, safe=False)

# def get_dividend(request):
#     dividends = list(Dividend.objects.values())
#     return JsonResponse({'items': dividends})



# 토큰 검증 생략
@csrf_exempt
# 회원가입
# 요청 데이터 불러와서 Membership에 업데이트 후 JSON 형식으로
# 클라이언트에 반환
def register_user(request):
    if request.method == 'POST':
        try:
            # 요청 데이터 로깅
            print("Received request body:", request.body)
            # 사용자 데이터 추출
            data = json.loads(request.body)
            # 추출된 데이터로 Membership모델에 새로운 레코드 생성
            Membership.objects.create(
                User=data['User'],
                Pw=data['Pw'],
                Name=data['Name'],
                Hp=data['Hp'],
                Ccode=data['Ccode'],
                Level=data.get('Level', None),
                Count=data.get('Count', 0)
            )
            # JSON 형식으로 리액트에 반환
            return JsonResponse({"message": "사용자가 성공적으로 등록되었습니다"}, status=201)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
    else:
        return JsonResponse({"error": "유효하지 않은 요청"}, status=400)


@csrf_exempt
# 중복 아이디 검사
# 요청한 아이디 조회, 디비에 해당 아이디 존재하는지 검사후
# 결과를 JSON 형식으로 클라이언트에 반환
def check_username(request):
    if request.method == 'GET':
        username = request.GET.get('User')
        # Membership 모델에서 해당 사용자 이름이 존재하는지 검사
        is_taken = Membership.objects.filter(User=username).exists()
        # 결과 JSON으로 반환
        return JsonResponse({'is_taken': is_taken})
    else:
        return JsonResponse({'error': 'Invalid request'}, status=400)

@csrf_exempt
# 클라이언트에서의 로그인 아이디 레코드 조회
# 해당 레코드 비번과 일치하면 로그인 성공
# Ccode를 응답에 포함시킴
def handle_login(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        try:
            # 리액트에서의 로그인 아이디 레코드 user에 저장
            user = Membership.objects.get(User=data['User'])
            if user.Pw == data['Pw']:
                # 로그인 성공 시, 사용자의 Ccode를 응답에 포함시킵니다.
                return JsonResponse({'message': '로그인 성공!', 'Ccode': user.Ccode}, status=200)
            else:
                return JsonResponse({'error': '아이디 또는 비밀번호가 일치하지 않습니다.'}, status=401)
        except Membership.DoesNotExist:
            return JsonResponse({'error': '아이디 또는 비밀번호가 일치하지 않습니다.'}, status=401)
    else:
        return JsonResponse({'error': '잘못된 요청입니다.'}, status=400)


@csrf_exempt
# 전송된 이미지 장고 디렉토리에 저장
# 디렉토리 경로 + 추가 정보 조회하여
# 디비에 업데이트
# JSON 형식으로 클라이언트에 반환
def register_v1(request):
    if request.method == 'POST':
        # 리액트에서 전송한 첨부이미지 file에 저장
        file = request.FILES.get('file')
        if not file:
            return JsonResponse({'message': '파일이 없습니다'}, status=400)

        # 파일 저장 디렉토리 확인 및 생성
        upload_dir = 'uploaded_files'
        if not os.path.exists(upload_dir):
            os.makedirs(upload_dir)

        # 파일 저장 로직
        file_path = os.path.join(upload_dir, file.name)
        with open(file_path, 'wb+') as destination:
            for chunk in file.chunks():
                destination.write(chunk)

        # React에서 보낸 Ccode 및 User 정보 가져오기
        ccode = request.POST.get('Ccode')
        user = request.POST.get('User')
        add = request.POST.get('Add')
        title = request.POST.get('Title')
        time = request.POST.get('Time')


        # register 테이블 업데이트
        register_entry = Register(
            Ccode=ccode,
            User=user,
            Imgurl=file_path,
            Add=add,
            Title=title,
            Time=time,
            Workcode=None
            # 나머지 필드들은 기본값 또는 Null로 설정
        )
        register_entry.save()

        return JsonResponse({'message': '등록 성공'}, status=200)

    return JsonResponse({'message': '잘못된 요청'}, status=400)