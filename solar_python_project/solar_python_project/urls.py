"""
URL configuration for solar_python_project project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from solar_app import views
from django.http import HttpResponseRedirect

urlpatterns = [
    path("admin/", admin.site.urls),

    # company 테이블
    path('companies/', views.get_companies, name='get_companies'),
    path('get_company_name/<int:ccode>/', views.get_company_name, name='get_company_name'),

    # register 테이블
    path('get_registers/', views.get_registers, name='get_registers'),
    path('get_registers/user/<str:user>/', views.get_registers, name='get_registers_by_user'),
    path('register_detail/<int:bunho>/', views.register_detail, name='register_detail'),
    path('register_detail/<str:user>/', views.register_detail, name='register_detail'),
    path('check_register/<str:User>/', views.check_register, name='check_register'),

    # membership 테이블
    path('get_membership/', views.get_membership, name='get_membership'),
    path('get_membership_ccode/ccode/<int:ccode>/', views.get_membership_ccode, name='get_membership_by_ccode'),
    path('get_membership_ccode/user/<str:user>/', views.get_membership_ccode, name='get_membership_by_user'),
    path('get_membership_ccode/ccode/<int:ccode>/level/<str:level>/', views.get_membership_ccode,
         name='get_membership_by_ccode_level'),
    path('get_membership_level/<str:User>/', views.get_membership_level, name='get_membership_level'),

    # dividend 테이블
    path('get_dividend/', views.get_dividend, name='get_dividend'),
    path('get_dividend/user/<str:user>/', views.get_dividend, name='get_dividend_by_user'),
    path('update_dividend/', views.update_dividend, name='update_dividend'),

    # 회원가입
    path('register/', views.register_user, name='register_user'),
    # 아이디 중복검사
    path('check_username/', views.check_username, name='check_username'),
    # 로그인
    path('login/', views.handle_login, name='handle_login'),
    # 일반회원 접수신청
    path('register_v1', views.register_v1, name='register_v1'),
    # 회원탈퇴
    path('delete_user/', views.delete_user, name='delete_user'),

    path('predict_image/user/<str:user>/', views.predict_image, name='predict_image_by_user'),
    path('api/submit_dividend', views.submit_dividend, name='submit_dividend'),
]
