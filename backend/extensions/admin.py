from flask_admin import Admin

from backend.admin.views import AdminDashboardView


admin = Admin(name='Flask React SPA Admin',
              index_view=AdminDashboardView(),
              template_mode='bootstrap3',
              )
