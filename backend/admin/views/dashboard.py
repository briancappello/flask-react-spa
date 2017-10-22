from flask_admin import AdminIndexView as BaseAdminIndexView, expose


class AdminDashboardView(BaseAdminIndexView):
    @expose('/')
    def index(self):
        return self.render('admin/dashboard.html')
