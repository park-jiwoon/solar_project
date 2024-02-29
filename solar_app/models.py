from django.db import models

class Company(models.Model):
    Ccode = models.IntegerField(primary_key=True, default=0)
    Pw = models.CharField(max_length=30, null=True, blank=True)
    Call = models.CharField(max_length=20, null=True, blank=True)
    Add = models.CharField(max_length=50, null=True, blank=True)
    Cname = models.CharField(max_length=15, null=True, blank=True)

    class Meta:
        db_table = 'company'

class Membership(models.Model):
    User = models.CharField(max_length=20, primary_key=True)
    Pw = models.CharField(max_length=30)
    Name = models.CharField(max_length=20)
    Hp = models.CharField(max_length=20, null=True, blank=True)
    Ccode = models.IntegerField()
    Level = models.CharField(max_length=10, null=True, blank=True)
    Count = models.IntegerField(default=0)

    class Meta:
        db_table = 'membership'

class Register(models.Model):
    Bunho = models.AutoField(primary_key=True)
    Ccode = models.IntegerField()
    User = models.CharField(max_length=20)
    Add = models.CharField(max_length=50, blank=True, null=True)
    Imgurl = models.CharField(max_length=50, blank=True, null=True)
    Title = models.CharField(max_length=50, blank=True, null=True)
    Time = models.DateTimeField(blank=True, null=True)
    Workcode = models.CharField(max_length=20, blank=True, null=True)

    class Meta:
        db_table = 'register'



class Dividend(models.Model):
    Workcode = models.CharField(max_length=20, primary_key=True)
    Adate = models.CharField(max_length=10, null=True, blank=True)
    Cdate = models.CharField(max_length=10, null=True, blank=True)
    User = models.ForeignKey('Membership', on_delete=models.CASCADE, db_column='User')
    Bunho = models.IntegerField()
    Saveurl = models.CharField(max_length=50, null=True, blank=True)
    Worker = models.CharField(max_length=20, null=True, blank=True)
    state = models.CharField(max_length=20, null=True, blank=True)

    class Meta:
        db_table = 'dividend'
