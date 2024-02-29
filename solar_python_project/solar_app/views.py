from django.shortcuts import render

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from solar_app.models import Membership
from solar_app.models import Company
from solar_app.models import Register
from solar_app.models import Dividend
from django.shortcuts import get_object_or_404
import os
import json
import base64
from django.core import serializers
from django.conf import settings
import requests
import logging
logger = logging.getLogger(__name__)

# company 테이블 불러오기
# company 테이블 모든 레코드 조회하여 JSON 형식으로
# 클라이언트에 반환
def get_companies(request):
    # 모든 레코드 조회
    companies = list(Company.objects.values())
    # JSON 형식으로 리액트에 반환
    return JsonResponse(companies, safe=False)

# 요청된 Ccode의 Cname 응답
def get_company_name(request, ccode):
    try:
        company = Company.objects.get(Ccode=ccode)
        return JsonResponse({'Cname': company.Cname})
    except Company.DoesNotExist:
        return JsonResponse({'error': 'Company not found'}, status=404)
# 겹치지 않음


# register 테이블 불러오기
def get_registers(request,user=None):
    try:
        if user is not None:
            register = Register.objects.get(User=user)
            data = {
                'Imgurl': register.Imgurl,
            }
            return JsonResponse(data)
        else:
            registers = list(Register.objects.values())
            return JsonResponse(registers, safe=False)
    except Register.DoesNotExist:
        return JsonResponse({'error': 'Register not found'}, status=404)



def register_detail(request, bunho=None, user=None):
    try:
        if user is not None:
            register = Register.objects.get(User=user)
            company = Company.objects.get(Ccode=register.Ccode)

            try:
                dividend = Dividend.objects.get(Bunho=register.Bunho)
            except Dividend.DoesNotExist:
                dividend = None

            try:
                worker = Membership.objects.get(User=dividend.Worker) if dividend else None
            except Membership.DoesNotExist:
                worker = None

            data = {
                'Cname': company.Cname,
                'User': register.User,
                'Add': register.Add,
                'Time': register.Time,
                'Title': register.Title,
                'Imgurl': register.Imgurl,
            }

            if dividend:
                data.update({
                    'State': dividend.state,
                    'Adate': dividend.Adate,
                    'Cdate': dividend.Cdate,
                })

            if worker:
                data.update({'Worker': worker.Name})

            img_path = register.Imgurl
            with open(img_path, "rb") as img_file:
                encoded_string = base64.b64encode(img_file.read()).decode('utf-8')

            data['ImgBase64'] = encoded_string
        elif bunho is not None:
            register = Register.objects.get(Bunho=bunho)
            membership = Membership.objects.get(User=register.User)
            data = {
                'Bunho': register.Bunho,
                'Ccode': register.Ccode,
                'User': register.User,
                'Add': register.Add,
                'Imgurl': register.Imgurl,
                'Title': register.Title,
                'Time': register.Time,
                'Name': membership.Name
            }
        else:
            return JsonResponse({'error': 'No valid parameter provided'}, status=400)

        return JsonResponse(data)
    except Register.DoesNotExist:
        return JsonResponse({'error': 'Register not found'}, status=404)
    except Membership.DoesNotExist:  # 추가된 코드
        return JsonResponse({'error': 'Membership not found'}, status=404)



# membership 테이블 불러오기
def get_membership(request):
    membership = list(Membership.objects.values())
    return JsonResponse(membership, safe=False)

def get_membership_ccode(request, ccode=None, level=None, user=None):
    try:
        if level is not None:
            memberships = Membership.objects.filter(Ccode=ccode, Level=level)
            if memberships.exists():
                data = serializers.serialize('json', memberships)
                return JsonResponse(json.loads(data), safe=False)  # 여기를 수정했습니다.
            else:
                return JsonResponse({'error': 'Membership with the provided Ccode not found'}, status=404)
        elif user is not None:
            memberships = Membership.objects.filter(User=user)
            if memberships.exists():
                membership = memberships.first()
                data = {
                    'Name': membership.Name,
                }
                return JsonResponse(data)
            else:
                return JsonResponse({'error': 'Membership with the provided Name not found'}, status=404)
        else:
            memberships = Membership.objects.filter(Ccode=ccode)
            if memberships.exists():
                membership = memberships.first()
                data = {
                    'Ccode': membership.Ccode,
                }
                return JsonResponse(data)
            else:
                return JsonResponse({'error': 'Membership with the provided Ccode not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

# User를 요청 받아서
# Level 응답
def get_membership_level(request, User):
    try:
        membership = Membership.objects.get(User=User)
        return JsonResponse({'Level': membership.Level})
    except Membership.DoesNotExist:
        return JsonResponse({'error': 'Membership not found'}, status=404)


def get_dividend(request, user=None):
    try:
        if user is not None:
            dividends = Dividend.objects.filter(Worker=user)
            if dividends.exists():
                data = []
                for dividend in dividends:
                    register_data = dividend.Bunho  # Register 모델 인스턴스
                    img_path = register_data.Imgurl  # Register 모델의 Imgurl 필드 사용
                    try:
                        with open(img_path, "rb") as img_file:
                            encoded_string = base64.b64encode(img_file.read()).decode('utf-8')
                    except Exception as e:
                        encoded_string = str(e)  # 이미지 로딩 실패 시 예외 메시지 저장
                    data.append({
                        'Dividend': {
                            'Workcode': dividend.Workcode,
                            'Adate': dividend.Adate,
                            'Cdate': dividend.Cdate,
                            'User': dividend.User.User,  # Membership 모델의 User 필드 접근
                            'UserName': dividend.User.Name,
                            'Bunho': register_data.Bunho,
                            'state': dividend.state,
                            # 다른 필요한 Dividend 필드
                        },
                        'Register': {
                            'Add': register_data.Add,
                            'Imgurl': register_data.Imgurl,
                            'Title': register_data.Title,
                            # 다른 필요한 Register 필드
                        },
                        'ImgBase64': encoded_string  # Base64 인코딩된 이미지 데이터 추가
                    })
                return JsonResponse(data, safe=False)
        else:
            # 모든 레코드 조회
            dividend = list(Dividend.objects.values())
            # JSON 형식으로 리액트에 반환
            return JsonResponse(dividend, safe=False)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
def update_dividend(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            workcode = data.get('Workcode')
            cdate = data.get('Cdate')

            # Dividend 객체를 Workcode를 기준으로 조회
            dividend = Dividend.objects.get(Workcode=workcode)

            # Cdate 업데이트
            dividend.Cdate = cdate
            dividend.save()

            return JsonResponse({'message': 'Cdate updated successfully!'})
        except Dividend.DoesNotExist:
            return JsonResponse({'error': 'Dividend not found'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

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
                Level=data['Level'],
                Count=data.get('Count', 0)
            )
            # JSON 형식으로 리액트에 반환
            return JsonResponse({"message": "사용자가 성공적으로 등록되었습니다"}, status=201)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
    else:
        return JsonResponse({"error": "유효하지 않은 요청"}, status=400)

def check_register(request, User):
    try:
        is_taken = Register.objects.filter(User=User).exists()
        return JsonResponse({'is_taken': is_taken})
    except Register.DoesNotExist:
        return JsonResponse({'error': 'Register not found'}, status=404)

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


# 회원탈퇴
@csrf_exempt
def delete_user(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            user = Membership.objects.get(User=data['User'])
            user.delete()  # 사용자 삭제
            return JsonResponse({'message': '회원 탈퇴가 성공적으로 처리되었습니다'}, status=200)
        except Membership.DoesNotExist:
            return JsonResponse({'error': '사용자를 찾을 수 없습니다'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return JsonResponse({'error': '잘못된 요청'}, status=400)


def predict_image(request, user):
    # User를 기반으로 이미지 URL을 가져와서 Flask로 전송하고 예측 결과를 반환
    try:
        register = Register.objects.get(User=user)
        image_file_path = os.path.join(settings.MEDIA_ROOT, register.Imgurl)
        with open(image_file_path, 'rb') as image_file:
            response = requests.post(
                'http://127.0.0.1:5000/predict',
                files={'file': image_file}
            )

        print(response.text)
        predicted_state = response.json().get('prediction')
        register.state = predicted_state
        register.save()

        return JsonResponse({'predicted_state': predicted_state})
    except Register.DoesNotExist:
        return JsonResponse({'error': 'Register not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
def submit_dividend(request):
    if request.method == 'POST':
        # JSON 데이터를 파싱합니다.
        data = json.loads(request.body)

        # 필요한 값을 추출합니다.
        workcode = data.get('Workcode')
        adate = data.get('Adate')
        worker = data.get('Worker')
        state = data.get('State')
        bunho = data.get('Bunho')
        user_id = data.get('User')

        # 데이터 유효성 검사를 수행합니다.
        if not all([workcode, adate, worker, state, bunho, user_id]):
            return JsonResponse({'error': 'Missing data'}, status=400)

        try:
            # Register와 Membership 인스턴스를 조회합니다.
            register_instance = Register.objects.get(pk=bunho)
            membership_instance = Membership.objects.get(pk=user_id)

            # Dividend 인스턴스를 생성합니다.
            dividend, created = Dividend.objects.get_or_create(
                workcode=workcode,
                defaults={
                    'adate': adate,
                    'state': state,
                    'worker': worker,  # 이 값은 Worker 모델의 실제 필드명에 따라 달라질 수 있습니다.
                    'bunho': register_instance,
                    'user': membership_instance
                }
            )

            if created:
                return JsonResponse({'message': 'Dividend created successfully'}, status=201)
            else:
                return JsonResponse({'message': 'Dividend updated successfully'}, status=200)

        except Register.DoesNotExist:
            return JsonResponse({'error': 'Register with this Bunho does not exist'}, status=404)
        except Membership.DoesNotExist:
            return JsonResponse({'error': 'Membership with this User ID does not exist'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid request'}, status=405)