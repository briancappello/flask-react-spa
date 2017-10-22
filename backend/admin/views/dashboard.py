from flask_admin import AdminIndexView as BaseAdminIndexView, expose

from ..security import AdminSecurityMixin


class AdminDashboardView(AdminSecurityMixin, BaseAdminIndexView):
    @expose('/')
    def index(self):
        return self.render('admin/dashboard.html')
