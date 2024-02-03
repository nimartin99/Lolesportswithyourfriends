<template>
    <v-main>
        <div class="loginOuter">
            <v-card
                class="mx-auto pa-12 pb-8"
                style="width: 50%; min-width: 350px"
                elevation="8"
                max-width="448"
                rounded="lg"
            >
                <div class="text-subtitle-1 text-medium-emphasis">Login</div>

                <v-text-field
                    v-model="username"
                    density="compact"
                    placeholder="Username"
                    prepend-inner-icon="mdi-email-outline"
                    variant="outlined"
                ></v-text-field>

                <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
                    Password

<!--                    <a-->
<!--                        class="text-caption text-decoration-none text-blue"-->
<!--                        href="#"-->
<!--                        rel="noopener noreferrer"-->
<!--                        target="_blank"-->
<!--                    >-->
<!--                        Forgot login password?</a>-->
                </div>

                <v-text-field
                    v-model="password"
                    :append-inner-icon="passwordVisible ? 'mdi-eye-off' : 'mdi-eye'"
                    :type="passwordVisible ? 'text' : 'password'"
                    density="compact"
                    placeholder="Enter your password"
                    prepend-inner-icon="mdi-lock-outline"
                    variant="outlined"
                    @click:append-inner="passwordVisible = !passwordVisible"
                ></v-text-field>

<!--                <v-card-->
<!--                    class="mb-12"-->
<!--                    color="surface-variant"-->
<!--                    variant="tonal"-->
<!--                >-->
<!--                    <v-card-text class="text-medium-emphasis text-caption">-->
<!--                        Warning: After 3 consecutive failed login attempts, you account will be temporarily locked for three hours. If you must login now, you can also click "Forgot login password?" below to reset the login password.-->
<!--                    </v-card-text>-->
<!--                </v-card>-->

                <v-btn
                    block
                    class="mb-8"
                    color="blue"
                    size="large"
                    variant="tonal"
                    @click="login"
                >
                    Log In
                </v-btn>
            </v-card>
        </div>
    </v-main>
</template>

<script>
import * as request from "@/api/request";

export default {
    name: "Login",
    // Properties returned from data() become reactive state
    // and will be exposed on `this`.
    data() {
        return {
            passwordVisible: false,
            username: '',
            password: '',
        }
    },

    // Methods are functions that mutate state and trigger updates.
    // They can be bound as event handlers in templates.
    methods: {
        async login() {
            const response = await fetch('http://' + '85.215.158.110:3000' + '/api/auth/signin', {
                method: "POST", // *GET, POST, PUT, DELETE, etc.
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: this.username,
                    password: this.password,
                })
            });

            if(response.status === 200) {
                const res = await response.json()
                document.cookie = `token=${res.token}`
                console.log("Login successful!");
                this.$router.push("/Bet");

            } else {
                console.log("Login failed");
            }
        },

        async testPriviliges() {
            const response = await request.getRequest("/test/user");
            const res = await response.json()
            console.log("Login successful!", res);
        },
    },
}
</script>

<style scoped>
.loginOuter {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
}
</style>
