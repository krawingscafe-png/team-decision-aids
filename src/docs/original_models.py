from django.core.files.storage import FileSystemStorage
from django.db import models
from datetime import datetime
# Create your models here.
from torbayapp_main import settings 




class registerUser(models.Model):
    id = models.AutoField(primary_key=True, auto_created=True)
    userName = models.CharField(max_length=155)
    password = models.CharField(max_length=155)
    email    = models.CharField(max_length=155)
    title    = models.CharField(max_length=120)
    description = models.CharField(max_length=255)
    keywords = models.CharField(max_length=255)
    logo =  models.CharField(max_length=155)
    # logo = models.FileField(storage=FileSystemStorage(location=settings.MEDIA_ROOT), upload_to='logos', default='/anonymous.jpg')
    locked   = models.IntegerField(default=0)
    logAfterUTC = models.DateTimeField()
    failedAttempt = models.IntegerField(default=0)
    createdDate = models.DateTimeField(auto_now_add=True)

class sessionHandling(models.Model):
    id                  = models.AutoField(primary_key=True, auto_created=True)
    userName            = models.CharField(max_length=155)
    # password            = models.CharField(max_length=155)
    isAuthentication    = models.IntegerField(default=0)
    sessionTime         = models.DateTimeField()
    createdDate         = models.DateTimeField(auto_now_add=True)

class torbayFacility(models.Model):
    id = models.AutoField(primary_key=True, auto_created=True)
    name = models.CharField(max_length=155)
    accessibleName = models.CharField(max_length=50)
    # logo = models.FileField(storage=FileSystemStorage(location=settings.MEDIA_ROOT), upload_to='logos', default='/anonymous.jpg')
    logo = models.CharField(max_length=155)
    status = models.IntegerField(default=0)
    createdDate = models.DateTimeField(auto_now_add=True)



class FacilityUser(models.Model):
    id = models.AutoField(primary_key=True, auto_created=True)
    torbaySubscriptionId = models.IntegerField()
    address = models.CharField(max_length=200)
    email = models.CharField(max_length=50)
    phone = models.CharField(max_length=15)
    userName = models.CharField(max_length=25)
    password = models.CharField(max_length=100)
    # personName = models.CharField(max_length=100)
    isSuperAdmin = models.IntegerField(default=0)
    locked = models.IntegerField(default=0)
    logAfterUTC = models.DateTimeField()
    failedAttempt = models.IntegerField(default=0)
    status = models.IntegerField(default=0)
    createdDate = models.DateTimeField(auto_now_add=True)

class chartSubscription(models.Model):
    chartSubscriptionId = models.AutoField(primary_key=True, auto_created=True)
    facilityId          = models.IntegerField()
    chartId             = models.IntegerField()
    chartSubscriptionSlug = models.CharField(max_length=155,default=None,null=True)
    displayOrder        = models.IntegerField()
    homePageMode        = models.IntegerField(default=1)
    conditionPageMode   = models.IntegerField(default=1)
    homePageDisplay     = models.IntegerField(default=1)
    conditionPageDisplay= models.IntegerField(default=1)
    status              = models.IntegerField(default=0)
    createdDate         = models.DateTimeField(auto_now_add=True)

class chartDetails(models.Model):
    id                  = models.AutoField(primary_key=True, auto_created=True)
    chartName           = models.CharField(max_length=155)
    chartSlug           = models.CharField(max_length=155,default=None)
    chartOwnership      = models.CharField(max_length=100,default='torbay')	
    chartOrder          = models.IntegerField(default=0)
    homePageMode        = models.IntegerField(default=1)
    conditionPageMode   = models.IntegerField(default=1)
    homePageDisplay     = models.IntegerField(default=1)
    conditionPageDisplay = models.IntegerField(default=1)
    levelOnePreview     = models.IntegerField(default=1)
    chartImage          =  models.CharField(max_length=155)
    chartExamdetails    = models.CharField(max_length=75,default='Leg shortening')
    # chartImage          = models.FileField(storage=FileSystemStorage(location=settings.MEDIA_ROOT), upload_to='chartImages', default='/anonymous.jpg')
    status              = models.IntegerField(default=0)
    createdDate         = models.DateTimeField(auto_now_add=True)

#Chart Y Plot Axis details
class painAnalysis(models.Model):
    analyseId           = models.AutoField(primary_key=True, auto_created=True)
    analyseName         = models.CharField(max_length=40)
    analyseIndex        = models.IntegerField(default=0)

#Chart X Plot details
class painAnalysisStages(models.Model):
    analyseStageId      = models.AutoField(primary_key=True, auto_created=True)
    analyseStageName    = models.CharField(max_length=25)
    analyseStageIndex   = models.IntegerField()

class treatmentDetails(models.Model):
    treatmentId         = models.AutoField(primary_key=True, auto_created=True)#AUTO FIELD
    chartId             = models.IntegerField()               #PARENT CHART ID
    treatmentIndex      = models.IntegerField()               #X PLOT ID - TREATMENT INDEX - X axis
    treatmentName       = models.CharField(max_length=120)    #TREATMENT NAME
    treatmentSlug       = models.CharField(max_length=120,default=None)    # TREATMENT SLUG
    painFromStage       = models.IntegerField()               #FROM STAGE - Y axis
    painToStage         = models.IntegerField()               #TO STAGE - Y axis
    createdDate         = models.DateTimeField(auto_now_add=True)
    status              = models.IntegerField(default=0)      #1 - active - 2 - Inactive, 3- archieved
    cost_details        = models.CharField(max_length=120,default='')
    applicable_from_stage   =  models.IntegerField(default=0)
    applicable_to_stage     = models.IntegerField(default=0)
    best_from_stage         = models.IntegerField(default=0)
    best_to_stage           = models.IntegerField(default=0)
    treatment_legends = models.TextField(default='[]')
    position             = models.IntegerField(default=0)  # New field for position
    star_rating = models.PositiveSmallIntegerField(null=True, blank=True)
    star_text   = models.CharField(max_length=160, blank=True, default='')

class treatmentActivityDetails(models.Model):
    activityId          = models.AutoField(primary_key=True, auto_created=True)#AUTO FIELD
    treatmentId         = models.IntegerField()            #PARENT CHART ID
    activityOrder       = models.IntegerField(default=0)   #X PLOT ID - TREATMENT INDEX - X axis
    activityTitle       = models.TextField(max_length=120) #TREATMENT NAME
    activitySlug        = models.TextField(max_length=120,default=None) #TREATMENT SLUG
    activityDescription = models.TextField(default='')               #FROM STAGE - Y axis
    activityQnId        = models.CharField(max_length=40,default='')
    createdDate         = models.DateTimeField(auto_now_add=True)
    status              = models.IntegerField(default=0)   #    1 - active - 2 - Inactive, 3- archieved

class treatmentActivityLimitation(models.Model):
  #  activityLimitationId = models.AutoField(primary_key=True, auto_created=True)
    treatmentId = models.IntegerField()
    bestWorkingStages = models.CharField(max_length=20,default='')
    applicableStages = models.CharField(max_length=20,default='')
    costDetails =  models.CharField(max_length=20,default='')


class treamentReferences(models.Model):
    referenceLinkId = models.AutoField(primary_key=True, auto_created=True)
    treatmentId = models.IntegerField()
    referenceTitle = models.CharField(max_length=80, default='')
    referenceLink = models.CharField(max_length=250, default='')
    referencePDF = models.FileField(upload_to='reference_pdfs/', null=True, blank=True) 

    
class treamentVideos(models.Model):
    referenceVideoId = models.AutoField(primary_key=True, auto_created=True)  # AUTO FIELD
    treatmentId = models.IntegerField()
    referenceVideoTitle = models.CharField(max_length=80, default='')
    referenceVideoLink = models.CharField(max_length=250, default='')
    isPrimary = models.IntegerField(default=0)
    videoThumbnail = models.CharField(max_length=250, default='')

class chartReport(models.Model):
    id = models.AutoField(primary_key=True, auto_created=True)
    chartId = models.CharField(max_length=80,default='')
    infoGraphicPrintCount = models.IntegerField(default=0)
    infoGraphicDownloadCount = models.IntegerField(default=0)
    textPrintCount = models.IntegerField(default=0)
    textDownloadCount = models.IntegerField(default=0)
    treatmentPrintCount = models.IntegerField(default=0)
    treatmentDownloadCount = models.IntegerField(default=0)
    createdDate = models.DateTimeField(auto_now_add=True)

class survey(models.Model):
    id = models.AutoField(primary_key=True, auto_created=True)
    surveyOriginSite = models.CharField(max_length=80,default='')
    surveyJsonString = models.TextField()
    surveyType = models.CharField(max_length=80,default='')
    ipAddress = models.CharField(max_length=45,default='')
    locationInfo = models.CharField(max_length=255,default='')
    createdDate = models.DateTimeField(auto_now_add=True)


class Podcast(models.Model):
    podcast_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    youtube_url = models.URLField()
    template_image = models.ImageField(upload_to='podcast_images/', null=True, blank=True)
    created_by = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name   


class FAQ(models.Model):
    CATEGORY_CHOICES = (
        (1, 'Patients'),
        (2, 'Healthcare Professionals'),
        (3, 'Commissioners'),
    )

    question = models.TextField()
    answer = models.TextField()
    category = models.IntegerField(choices=CATEGORY_CHOICES)
    position = models.PositiveIntegerField(default=0)  # 👈 Add this line

    class Meta:
        unique_together = ('category', 'position')
        ordering = ['position']  # 👈 Order by position by default

    def __str__(self):
        return f"FAQ {self.id}: {self.question}"


class Testimonial(models.Model):
    CATEGORY_CHOICES = (
        (1, 'Consultants'),
        (2, 'GP'),
        (3, 'ESP'),
        (4, 'Physiotherapist'),
        (5, 'Patients'),
    )

    title = models.CharField(max_length=255)
    profile = models.CharField(max_length=255)  # Store only the position
    image = models.ImageField(upload_to='testimonials/', blank=True, null=True)
    content = models.TextField()
    category = models.IntegerField(choices=CATEGORY_CHOICES)

    class Meta:
        ordering = ['category']

    def __str__(self):
        return f"Testimonial {self.id}: {self.title}"
    

class ApiSettings(models.Model):
    """Single-row table: always only ONE API key / model."""
    ai_model = models.CharField(max_length=50, choices=[('openai','OpenAI'),('grok','Grok')])
    api_key  = models.TextField()
    updated_at = models.DateTimeField(auto_now=True)
    is_active  = models.PositiveIntegerField(default=0)
    def _str_(self):
        return f"{self.ai_model} – {self.api_key[:8]}…"

    class Meta:
        verbose_name = "API Setting"
        verbose_name_plural = "API Settings"



class AiDocument(models.Model):
    treatment_name = models.CharField(max_length=120)
    pdf_file       = models.FileField(upload_to='ai_pdfs/')
    uploaded_at    = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.treatment_name

    class Meta:
        ordering = ['-uploaded_at']    