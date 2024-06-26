
export default {
  dashboardItems() {
    return [
      {
        separator: true
      },
      {
        label: 'Dashboard',
        icon: 'pi pi-fw pi-home',
        route: '/admin/dashboard'
      },
      {
        label: 'Products',
        icon: 'pi pi-fw pi-star',
        route: '/admin/products'
      },
      {
        label: 'Categories',
        icon: 'pi pi-fw pi-th-large',
        route: '/admin/categories'
      },
      {
        label: 'Brands',
        icon: 'pi pi-fw pi-tag',
        route: '/admin/brands'
      },
      {
        label: 'Orders',
        icon: 'pi pi-fw pi-shopping-cart',
        route: '/admin/orders'
      },
      {
        label: 'Customers',
        icon: 'pi pi-fw pi-user',
        route: '/admin/customers'
      },
      {
        label: 'Users',
        icon: 'pi pi-fw pi-users',
        route: '/admin/users'
      },
      {
        separator: true
      },
      {
        label: 'Profile',
        icon: 'pi pi-fw pi-user',
        route: '/admin/profile'
      },
      {
        label: 'Shop Configuration',
        icon: 'pi pi-fw pi-cog',
        route: '/admin/configuration'
      },
      {
        label: 'Logout',
        icon: 'pi pi-fw pi-power-off',
        route: '/logout'
      },
      {
        separator: true
      }
    ]
  }
}
