import router from "@/router";
import { defineStore } from "pinia";
import { dummyUsers, type User } from "@/assets/users.js";

type PublicUser = Omit<User, 'password'>;

interface AuthState {
    user: PublicUser | null;
    token: string | null;
}

export const useAuthStore = defineStore('auth', {
    state: (): AuthState => {
        const savedUser = window.localStorage.getItem('user');

        return {
            user: savedUser ? (JSON.parse(savedUser) as PublicUser) : null,
            token: window.localStorage.getItem('token')
        };
    },

    getters: {
        isAuthenticated: (state) => !!state.token,
        user: (state) => state.user,
        userRole: (state) => state.user?.role ?? null,
        isAdmin: (state) => state.user?.role === 'admin',
        isBuyer: (state) => state.user?.role === 'buyer',
        isSeller: (state) => state.user?.role === 'seller'
    },
    actions: {
        setAuth(user: PublicUser | null, token: string) {
            this.user = user;
            this.token = token;
            window.localStorage.setItem('user', JSON.stringify(user));
            window.localStorage.setItem('token', token);

            if (user?.role === 'admin') {
                router.push('#');
            } else if (user?.role === 'seller') {
                router.push('#');
            } else {
                router.push('/');
            }
        },

        async login(email: string, password: string) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    const foundUser = dummyUsers.find(
                        (u: User) => u.email === email && u.password === password
                    );

                    if (foundUser) {
                        const dummyToken = 'jwt-token-mock-' + Math.random().toString(36).substring(2);
                        const { password: _password, ...userWithoutPassword } = foundUser;
                        this.setAuth(userWithoutPassword, dummyToken);
                        resolve(foundUser);
                    } else {
                        alert('Email atau Password Salah!');
                        reject(new Error('Invalid Credentials'));
                    }
                }, 400);
            });
        },

        async logout() {
            this.user = null;
            this.token = null;
            window.localStorage.removeItem('token');
            window.localStorage.removeItem('user');
            router.push('/login');
        }
    }
});

// import { defineStore } from 'pinia'
// import router from '@/router'
// import { dummyUsers } from '@/data/users'

// export const useAuthStore = defineStore('auth', {
//   state: () => ({
//     user: JSON.parse(window.localStorage.getItem('user')) || null,
//     token: window.localStorage.getItem('token') || null,
//   }),

//   getters: {
//     isAuthenticated: (state) => !!state.token,
//     currentUser: (state) => state.user,
//     userRole: (state) => state.user ? state.user.role : null,
//     isAdmin: (state) => state.user?.role === 'admin',
//     isBuyer: (state) => state.user?.role === 'buyer',
//     isSeller: (state) => state.user?.role === 'seller',
//   },

//   actions: {
//     setAuth(user, token) {
//       this.user = user
//       this.token = token
//       window.localStorage.setItem('user', JSON.stringify(user))
//       window.localStorage.setItem('token', token)
      
//       // Redirect otomatis berdasarkan role setelah login sukses
//       if (user.role === 'admin') {
//         router.push('/admin/dashboard')
//       } else if (user.role === 'seller') {
//         router.push('/seller/dashboard')
//       } else {
//         router.push('/')
//       }
//     },

//     async login(email, password) {
//       // Simulasi async request ke JSON / Dummy Database lokal
//       return new Promise((resolve, reject) => {
//         setTimeout(() => {
//           const foundUser = dummyUsers.find(
//             (u) => u.email === email && u.password === password
//           )

//           if (foundUser) {
//             // Buat dummy token acak
//             const dummyToken = 'jwt-token-mock-' + Math.random().toString(36).substring(2)
            
//             // Simpan data user (tanpa password)
//             const { password, ...userWithoutPassword } = foundUser
//             this.setAuth(userWithoutPassword, dummyToken)
//             resolve(foundUser)
//           } else {
//             alert('Email atau Password salah!')
//             reject(new Error('Invalid credentials'))
//           }
//         }, 400) // Simulasi delay jaringan
//       })
//     },

//     async logout() {
//       this.user = null
//       this.token = null
//       window.localStorage.removeItem('token')
//       window.localStorage.removeItem('user')
//       router.push('/login')
//     },
//   },
// })
