from django.shortcuts import render, get_object_or_404
from .models import Post, Contact
from django.core.paginator import Paginator

# Create your views here.

def home(request):
    return render(request, 'index.html')

def about(request):
    return render(request, 'about.html')

def project(request):
    return render(request, 'projects.html')

def services(request):
    return render(request, 'services.html')

def contact(request):
    context = {}
    if request.method == 'POST':
        name = request.POST.get('name', '').strip()
        email = request.POST.get('email', '').strip()
        subject = request.POST.get('subject', '').strip()
        message = request.POST.get('message', '').strip()
        
        if name and email and subject and message:
            try:
                # Create a new contact message
                contact = Contact.objects.create(
                    name=name,
                    email=email,
                    subject=subject,
                    message=message
                )
                context['success'] = True
                context['message'] = 'Your message has been sent successfully!'
            except Exception as e:
                context['error'] = True
                context['message'] = 'There was an error sending your message. Please try again.'
        else:
            context['error'] = True
            context['message'] = 'Please fill in all fields.'
            
    return render(request, 'contact.html', context)

# Example view to display a list of posts with pagination
def post_list(request):
    posts = Post.objects.filter(published=True)
    paginator = Paginator(posts, 10)  # Show 10 posts per page

    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    return render(request, 'post_list.html', {'page_obj': page_obj})

# Example view to display a single post detail
def post_detail(request, pk):
    post = get_object_or_404(Post, pk=pk, published=True)
    return render(request, 'post_detail.html', {'post': post})