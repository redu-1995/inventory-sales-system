from rest_framework import permissions

class RoleBasedPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        # 1. Allow authenticated users
        if not request.user or not request.user.is_authenticated:
            return False
            
        # 2. Admins can do everything
        # 2. Admins or native Django Superusers can do everything
        user_role = request.user.role.name if request.user.role else None

        # This addition catches BOTH your custom database role AND terminal-created superusers
        if user_role == 'Admin' or request.user.is_superuser:
            return True
        # Resolve the application app name (e.g., 'inventory', 'products', 'sales')
        view_module = view.__class__.__module__.split('.')[0]

        # 3. Always check SAFE METHODS (GET, HEAD, OPTIONS) first
        if request.method in permissions.SAFE_METHODS:
            # Block them from accessing the users app even for viewing
            if view_module == 'users':
                return False
            return True # Everyone authenticated can read inventory, products, sales, etc.

        # 4. ENFORCE WRITE ENFORCEMENTS (POST, PUT, PATCH, DELETE)
        if user_role == 'Inventory Staff':
            # ALLOW operational adjustments but block sales or user modifications
            return view_module in ['inventory', 'products']

        if user_role == 'Cashier':
            # ALLOW checking out customers but block inventory modification
            return view_module in ['sales', 'customers']

        if user_role == 'Manager':
            # Managers can manage operations but can't manage other employees
            return view_module != 'users'

        return False