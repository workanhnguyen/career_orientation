import { Home, Register, Login, Main, SearchUniversity, Survey, User } from '../pages'

const publicRoutes = [
    { path: '/', component: Home },
    { path: '/login', component: Login },
    { path: '/register', component: Register },
    { path: '/main', component: Main },
    { path: '/search-university', component: SearchUniversity },
    { path: '/survey', component: Survey },
    { path: '/current-user', component: User },
];

const privateRoutes = [
    
];

export { publicRoutes, privateRoutes }