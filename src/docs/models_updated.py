from django.core.files.storage import FileSystemStorage
from django.db import models
from datetime import datetime
from django.utils import timezone
# Create your models here.
from torbayapp_main import settings 


# =============================================================================
# EXISTING MODELS (preserved with minor enhancements)
# =============================================================================

class registerUser(models.Model):
    id = models.AutoField(primary_key=True, auto_created=True)
    userName = models.CharField(max_length=155)
    password = models.CharField(max_length=155)
    email    = models.CharField(max_length=155)
    title    = models.CharField(max_length=120)
    description = models.CharField(max_length=255)
    keywords = models.CharField(max_length=255)
    logo =  models.CharField(max_length=155)
    locked   = models.IntegerField(default=0)
    logAfterUTC = models.DateTimeField()
    failedAttempt = models.IntegerField(default=0)
    createdDate = models.DateTimeField(auto_now_add=True)


class sessionHandling(models.Model):
    id                  = models.AutoField(primary_key=True, auto_created=True)
    userName            = models.CharField(max_length=155)
    isAuthentication    = models.IntegerField(default=0)
    sessionTime         = models.DateTimeField()
    createdDate         = models.DateTimeField(auto_now_add=True)


class torbayFacility(models.Model):
    """Tenant/Organization model - represents each subscribing facility"""
    id = models.AutoField(primary_key=True, auto_created=True)
    name = models.CharField(max_length=155)
    accessibleName = models.CharField(max_length=50)
    logo = models.CharField(max_length=155)
    status = models.IntegerField(default=0)
    createdDate = models.DateTimeField(auto_now_add=True)
    
    # NEW: SaaS subscription fields for tenant
    subscription_plan = models.CharField(
        max_length=20,
        choices=[('free', 'Free'), ('pro', 'Pro'), ('enterprise', 'Enterprise')],
        default='free'
    )
    subscription_status = models.CharField(
        max_length=20,
        choices=[('active', 'Active'), ('cancelled', 'Cancelled'), ('expired', 'Expired'), ('trial', 'Trial')],
        default='trial'
    )
    subscription_expires = models.DateTimeField(null=True, blank=True)
    stripe_customer_id = models.CharField(max_length=100, null=True, blank=True)
    stripe_subscription_id = models.CharField(max_length=100, null=True, blank=True)
    
    # NEW: Branding customization
    primary_color = models.CharField(max_length=7, default='#0066CC')
    secondary_color = models.CharField(max_length=7, default='#004C99')
    
    class Meta:
        verbose_name = "Torbay Facility"
        verbose_name_plural = "Torbay Facilities"


class FacilityUser(models.Model):
    """User model - represents individual users within a facility"""
    id = models.AutoField(primary_key=True, auto_created=True)
    torbaySubscriptionId = models.IntegerField()  # Links to torbayFacility
    address = models.CharField(max_length=200)
    email = models.CharField(max_length=50)
    phone = models.CharField(max_length=15)
    userName = models.CharField(max_length=25)
    password = models.CharField(max_length=100)
    isSuperAdmin = models.IntegerField(default=0)
    locked = models.IntegerField(default=0)
    logAfterUTC = models.DateTimeField()
    failedAttempt = models.IntegerField(default=0)
    status = models.IntegerField(default=0)
    createdDate = models.DateTimeField(auto_now_add=True)
    
    # NEW: Individual user subscription (overrides facility if set)
    plan = models.CharField(
        max_length=20,
        choices=[('free', 'Free'), ('pro', 'Pro'), ('enterprise', 'Enterprise')],
        default='free'
    )
    subscription_status = models.CharField(
        max_length=20,
        choices=[('active', 'Active'), ('cancelled', 'Cancelled'), ('expired', 'Expired'), ('trial', 'Trial')],
        default='trial'
    )
    subscription_expires = models.DateTimeField(null=True, blank=True)
    
    # NEW: User role within facility
    role = models.CharField(
        max_length=20,
        choices=[('viewer', 'Viewer'), ('editor', 'Editor'), ('admin', 'Admin')],
        default='viewer'
    )
    
    # NEW: Email verification
    email_verified = models.BooleanField(default=False)
    email_verification_token = models.CharField(max_length=100, null=True, blank=True)
    email_verification_sent_at = models.DateTimeField(null=True, blank=True)
    
    # NEW: Profile fields
    first_name = models.CharField(max_length=50, blank=True, default='')
    last_name = models.CharField(max_length=50, blank=True, default='')
    avatar = models.CharField(max_length=255, blank=True, default='')
    job_title = models.CharField(max_length=100, blank=True, default='')
    
    class Meta:
        verbose_name = "Facility User"
        verbose_name_plural = "Facility Users"


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
    status              = models.IntegerField(default=0)
    createdDate         = models.DateTimeField(auto_now_add=True)


class painAnalysis(models.Model):
    """Chart Y Plot Axis details"""
    analyseId           = models.AutoField(primary_key=True, auto_created=True)
    analyseName         = models.CharField(max_length=40)
    analyseIndex        = models.IntegerField(default=0)


class painAnalysisStages(models.Model):
    """Chart X Plot details"""
    analyseStageId      = models.AutoField(primary_key=True, auto_created=True)
    analyseStageName    = models.CharField(max_length=25)
    analyseStageIndex   = models.IntegerField()


class treatmentDetails(models.Model):
    treatmentId         = models.AutoField(primary_key=True, auto_created=True)
    chartId             = models.IntegerField()
    treatmentIndex      = models.IntegerField()
    treatmentName       = models.CharField(max_length=120)
    treatmentSlug       = models.CharField(max_length=120,default=None)
    painFromStage       = models.IntegerField()
    painToStage         = models.IntegerField()
    createdDate         = models.DateTimeField(auto_now_add=True)
    status              = models.IntegerField(default=0)
    cost_details        = models.CharField(max_length=120,default='')
    applicable_from_stage   =  models.IntegerField(default=0)
    applicable_to_stage     = models.IntegerField(default=0)
    best_from_stage         = models.IntegerField(default=0)
    best_to_stage           = models.IntegerField(default=0)
    treatment_legends = models.TextField(default='[]')
    position             = models.IntegerField(default=0)
    star_rating = models.PositiveSmallIntegerField(null=True, blank=True)
    star_text   = models.CharField(max_length=160, blank=True, default='')


class treatmentActivityDetails(models.Model):
    activityId          = models.AutoField(primary_key=True, auto_created=True)
    treatmentId         = models.IntegerField()
    activityOrder       = models.IntegerField(default=0)
    activityTitle       = models.TextField(max_length=120)
    activitySlug        = models.TextField(max_length=120,default=None)
    activityDescription = models.TextField(default='')
    activityQnId        = models.CharField(max_length=40,default='')
    createdDate         = models.DateTimeField(auto_now_add=True)
    status              = models.IntegerField(default=0)


class treatmentActivityLimitation(models.Model):
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
    referenceVideoId = models.AutoField(primary_key=True, auto_created=True)
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
    position = models.PositiveIntegerField(default=0)

    class Meta:
        unique_together = ('category', 'position')
        ordering = ['position']

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
    profile = models.CharField(max_length=255)
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
    
    def __str__(self):
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


# =============================================================================
# NEW SAAS MODELS
# =============================================================================

class PlanLimits(models.Model):
    """Defines usage quotas for each subscription tier"""
    plan = models.CharField(
        max_length=20,
        choices=[('free', 'Free'), ('pro', 'Pro'), ('enterprise', 'Enterprise')],
        unique=True
    )
    charts_limit = models.IntegerField(default=10, help_text="-1 for unlimited")
    comparisons_limit = models.IntegerField(default=5, help_text="-1 for unlimited")
    saved_items_limit = models.IntegerField(default=10, help_text="-1 for unlimited")
    api_calls_limit = models.IntegerField(default=100, help_text="-1 for unlimited")
    export_enabled = models.BooleanField(default=False)
    team_members_limit = models.IntegerField(default=1, help_text="-1 for unlimited")
    priority_support = models.BooleanField(default=False)
    custom_branding = models.BooleanField(default=False)
    
    # Pricing
    monthly_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    annual_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Plan Limit"
        verbose_name_plural = "Plan Limits"
        
    def __str__(self):
        return f"{self.plan} Plan Limits"


class UsageTracking(models.Model):
    """Tracks usage metrics per user for quota enforcement"""
    user = models.ForeignKey(FacilityUser, on_delete=models.CASCADE, related_name='usage_records')
    facility = models.ForeignKey(torbayFacility, on_delete=models.CASCADE, related_name='usage_records')
    
    # Monthly counters (reset on billing cycle)
    period_start = models.DateField()
    period_end = models.DateField()
    
    # Usage metrics
    charts_viewed = models.IntegerField(default=0)
    comparisons_used = models.IntegerField(default=0)
    saved_items = models.IntegerField(default=0)
    api_calls = models.IntegerField(default=0)
    exports_count = models.IntegerField(default=0)
    
    # Status
    limit_exceeded = models.BooleanField(default=False)
    exceeded_at = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Usage Tracking"
        verbose_name_plural = "Usage Tracking Records"
        unique_together = ['user', 'period_start']
        indexes = [
            models.Index(fields=['user', 'period_start']),
            models.Index(fields=['facility', 'period_start']),
        ]
        
    def __str__(self):
        return f"Usage for {self.user.email} ({self.period_start} - {self.period_end})"


class AuditLog(models.Model):
    """Records all user actions for compliance and security tracking"""
    SEVERITY_CHOICES = [
        ('info', 'Info'),
        ('warning', 'Warning'),
        ('critical', 'Critical'),
    ]
    
    CATEGORY_CHOICES = [
        ('auth', 'Authentication'),
        ('user', 'User Management'),
        ('billing', 'Billing'),
        ('admin', 'Administration'),
        ('data', 'Data Access'),
    ]
    
    ACTION_CHOICES = [
        ('LOGIN', 'Login'),
        ('LOGOUT', 'Logout'),
        ('LOGIN_FAILED', 'Login Failed'),
        ('PROFILE_UPDATE', 'Profile Update'),
        ('PASSWORD_CHANGE', 'Password Change'),
        ('USER_ROLE_CHANGE', 'User Role Change'),
        ('SUBSCRIPTION_CHANGE', 'Subscription Change'),
        ('SUBSCRIPTION_CANCEL', 'Subscription Cancelled'),
        ('PAYMENT', 'Payment'),
        ('PAYMENT_FAILED', 'Payment Failed'),
        ('CHART_VIEW', 'Chart View'),
        ('CHART_EXPORT', 'Chart Export'),
        ('DATA_EXPORT', 'Data Export'),
        ('COMPARISON_CREATE', 'Comparison Created'),
        ('TENANT_BRANDING_UPDATE', 'Tenant Branding Update'),
        ('USER_INVITE', 'User Invited'),
        ('USER_REMOVED', 'User Removed'),
        ('API_KEY_CREATED', 'API Key Created'),
        ('API_KEY_REVOKED', 'API Key Revoked'),
    ]
    
    id = models.AutoField(primary_key=True)
    timestamp = models.DateTimeField(auto_now_add=True, db_index=True)
    
    # User context
    user = models.ForeignKey(
        FacilityUser, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='audit_logs'
    )
    user_email = models.CharField(max_length=100, default='unknown')  # Preserved even if user deleted
    facility = models.ForeignKey(
        torbayFacility, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='audit_logs'
    )
    
    # Action details
    action = models.CharField(max_length=50, choices=ACTION_CHOICES)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    severity = models.CharField(max_length=10, choices=SEVERITY_CHOICES, default='info')
    
    # Context
    description = models.TextField(blank=True, default='')
    details = models.JSONField(null=True, blank=True)  # Additional structured data
    
    # Request context
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True, default='')
    
    # Related resource
    resource_type = models.CharField(max_length=50, blank=True, default='')  # e.g., 'chart', 'user'
    resource_id = models.CharField(max_length=100, blank=True, default='')

    class Meta:
        verbose_name = "Audit Log"
        verbose_name_plural = "Audit Logs"
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['user', 'timestamp']),
            models.Index(fields=['facility', 'timestamp']),
            models.Index(fields=['action', 'timestamp']),
            models.Index(fields=['severity', 'timestamp']),
            models.Index(fields=['category', 'timestamp']),
        ]
        
    def __str__(self):
        return f"{self.timestamp} - {self.user_email} - {self.action}"


class OnboardingProgress(models.Model):
    """Tracks user progress through the onboarding tour"""
    user = models.OneToOneField(
        FacilityUser, 
        on_delete=models.CASCADE, 
        related_name='onboarding_progress'
    )
    
    # Tour completion
    tour_completed = models.BooleanField(default=False)
    tour_skipped = models.BooleanField(default=False)
    tour_completed_at = models.DateTimeField(null=True, blank=True)
    
    # Individual step tracking (JSON array of completed step IDs)
    completed_steps = models.JSONField(default=list)
    current_step = models.IntegerField(default=0)
    
    # Feature discovery
    has_viewed_charts = models.BooleanField(default=False)
    has_created_comparison = models.BooleanField(default=False)
    has_saved_item = models.BooleanField(default=False)
    has_exported_data = models.BooleanField(default=False)
    has_updated_profile = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Onboarding Progress"
        verbose_name_plural = "Onboarding Progress Records"
        
    def __str__(self):
        status = "Completed" if self.tour_completed else f"Step {self.current_step}"
        return f"Onboarding for {self.user.email}: {status}"


class UserNotification(models.Model):
    """In-app notifications for users"""
    NOTIFICATION_TYPES = [
        ('info', 'Information'),
        ('warning', 'Warning'),
        ('success', 'Success'),
        ('error', 'Error'),
    ]
    
    user = models.ForeignKey(
        FacilityUser, 
        on_delete=models.CASCADE, 
        related_name='notifications'
    )
    
    title = models.CharField(max_length=200)
    message = models.TextField()
    notification_type = models.CharField(max_length=20, choices=NOTIFICATION_TYPES, default='info')
    
    # Status
    is_read = models.BooleanField(default=False)
    read_at = models.DateTimeField(null=True, blank=True)
    
    # Optional action
    action_url = models.CharField(max_length=500, blank=True, default='')
    action_label = models.CharField(max_length=50, blank=True, default='')
    
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = "User Notification"
        verbose_name_plural = "User Notifications"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'is_read', 'created_at']),
        ]
        
    def __str__(self):
        return f"Notification for {self.user.email}: {self.title}"


class SavedItem(models.Model):
    """User's saved/bookmarked charts and comparisons"""
    ITEM_TYPES = [
        ('chart', 'Chart'),
        ('comparison', 'Comparison'),
        ('treatment', 'Treatment'),
    ]
    
    user = models.ForeignKey(
        FacilityUser, 
        on_delete=models.CASCADE, 
        related_name='saved_items'
    )
    
    item_type = models.CharField(max_length=20, choices=ITEM_TYPES)
    item_id = models.IntegerField()  # References chart, comparison, or treatment ID
    item_name = models.CharField(max_length=200)  # Denormalized for quick display
    
    # Optional organization
    folder = models.CharField(max_length=100, blank=True, default='')
    notes = models.TextField(blank=True, default='')
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Saved Item"
        verbose_name_plural = "Saved Items"
        unique_together = ['user', 'item_type', 'item_id']
        ordering = ['-created_at']
        
    def __str__(self):
        return f"{self.user.email} saved {self.item_type}: {self.item_name}"


class UserActivity(models.Model):
    """Tracks recent user activity for dashboard display"""
    ACTIVITY_TYPES = [
        ('chart_view', 'Viewed Chart'),
        ('comparison', 'Created Comparison'),
        ('save', 'Saved Item'),
        ('export', 'Exported Data'),
        ('search', 'Search'),
    ]
    
    user = models.ForeignKey(
        FacilityUser, 
        on_delete=models.CASCADE, 
        related_name='activities'
    )
    
    activity_type = models.CharField(max_length=30, choices=ACTIVITY_TYPES)
    description = models.CharField(max_length=255)
    
    # Optional reference
    resource_type = models.CharField(max_length=50, blank=True, default='')
    resource_id = models.IntegerField(null=True, blank=True)
    resource_name = models.CharField(max_length=200, blank=True, default='')
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "User Activity"
        verbose_name_plural = "User Activities"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'created_at']),
        ]
        
    def __str__(self):
        return f"{self.user.email}: {self.activity_type} at {self.created_at}"


class Comparison(models.Model):
    """User-created treatment comparisons"""
    user = models.ForeignKey(
        FacilityUser, 
        on_delete=models.CASCADE, 
        related_name='comparisons'
    )
    
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True, default='')
    
    # Compared items (JSON array of treatment IDs)
    treatment_ids = models.JSONField(default=list)
    chart_id = models.IntegerField(null=True, blank=True)
    
    # Sharing
    is_public = models.BooleanField(default=False)
    share_token = models.CharField(max_length=100, blank=True, default='')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Comparison"
        verbose_name_plural = "Comparisons"
        ordering = ['-updated_at']
        
    def __str__(self):
        return f"Comparison by {self.user.email}: {self.name}"


class BillingHistory(models.Model):
    """Payment and billing history for facilities"""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('succeeded', 'Succeeded'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
    ]
    
    facility = models.ForeignKey(
        torbayFacility, 
        on_delete=models.CASCADE, 
        related_name='billing_history'
    )
    
    # Stripe references
    stripe_payment_intent_id = models.CharField(max_length=100, blank=True, default='')
    stripe_invoice_id = models.CharField(max_length=100, blank=True, default='')
    
    # Payment details
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='GBP')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # Description
    description = models.CharField(max_length=255)
    plan = models.CharField(max_length=20, blank=True, default='')
    billing_period_start = models.DateField(null=True, blank=True)
    billing_period_end = models.DateField(null=True, blank=True)
    
    # Invoice
    invoice_url = models.URLField(blank=True, default='')
    invoice_pdf = models.URLField(blank=True, default='')
    
    created_at = models.DateTimeField(auto_now_add=True)
    paid_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = "Billing History"
        verbose_name_plural = "Billing History Records"
        ordering = ['-created_at']
        
    def __str__(self):
        return f"{self.facility.name} - {self.amount} {self.currency} ({self.status})"


class ReportSchedule(models.Model):
    """Scheduled report generation for admin"""
    FREQUENCY_CHOICES = [
        ('daily', 'Daily'),
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
    ]
    
    REPORT_TYPES = [
        ('usage', 'Usage Report'),
        ('revenue', 'Revenue Report'),
        ('activity', 'Activity Report'),
        ('audit', 'Audit Report'),
    ]
    
    name = models.CharField(max_length=200)
    report_type = models.CharField(max_length=20, choices=REPORT_TYPES)
    frequency = models.CharField(max_length=20, choices=FREQUENCY_CHOICES)
    
    # Recipients (JSON array of email addresses)
    recipients = models.JSONField(default=list)
    
    # Filters
    facility = models.ForeignKey(
        torbayFacility, 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True,
        help_text="Leave empty for all facilities"
    )
    
    # Status
    is_active = models.BooleanField(default=True)
    last_run_at = models.DateTimeField(null=True, blank=True)
    next_run_at = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(
        FacilityUser, 
        on_delete=models.SET_NULL, 
        null=True,
        related_name='created_reports'
    )

    class Meta:
        verbose_name = "Report Schedule"
        verbose_name_plural = "Report Schedules"
        
    def __str__(self):
        return f"{self.name} ({self.frequency})"
