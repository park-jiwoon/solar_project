from rest_framework import serializers
from .models import Membership

class MembershipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Membership
        fields = ['User', 'Pw', 'Name', 'Hp', 'Ccode', 'Level', 'Count']
