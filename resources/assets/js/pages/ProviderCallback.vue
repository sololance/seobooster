<template>
  <main-layout>
    <v-container fluid>
      <v-layout 
        row 
        wrap
      >
        <v-breadcrumbs>
          <v-icon 
            slot="divider" 
            color="teal"
          >
            forward
          </v-icon>
          <v-breadcrumbs-item
            active-class="primary--text"
            :disabled="false"
            to="/dashboard"
          >
            Dashboard
          </v-breadcrumbs-item>
          <v-breadcrumbs-item
            :disabled="true"
          >
            <span class="blue-grey--text">Accounts</span>
          </v-breadcrumbs-item>
        </v-breadcrumbs>
      </v-layout>
      <v-layout 
        row 
        wrap
      >
        <v-tabs 
          fixed 
          icons 
          centered
        >
          <v-tabs-bar>
            <v-tabs-slider color="primary"/>
            <v-tabs-item
              v-for="(tab,key) in tabs"
              :key="key"
              :href="`#${tab.name}`"
              ripple
              class="primary--text"
            >
              <v-icon :color="tab.iconColor">{{ tab.icon }}</v-icon>
              {{ tab.name }}
            </v-tabs-item>
          </v-tabs-bar>
          <v-tabs-items>
            <v-tabs-content
              v-for="(tab, key) in tabs"
              :key="key"
              :id="tab.name"
            >
              <v-card 
                flat 
                :light="true"
              >
                <component 
                  :is="tab.component" 
                  :tab="tab"
                />
              </v-card>
            </v-tabs-content>
          </v-tabs-items>
        </v-tabs>
      </v-layout>
    </v-container>
  </main-layout>
</template>

<script>

import MainLayout from '../layouts/Main.vue'
import Theme from '../mixins/theme'
import BlogAccounts from '../components/accounts/BlogAccounts.vue'  
import SocialAccounts from '../components/accounts/SocialAccounts.vue'
import VideoAccounts from '../components/accounts/VideoAccounts.vue'
import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('auth')

export default {
    components: {
        MainLayout,
        BlogAccounts,
        SocialAccounts,
        VideoAccounts
    },
    mixins: [Theme],
    props:{
        provider: {
            type: String,
            required: true
        },
        query: {
            type: Object,
            required: true
        }
    },
    data: () => ({
        accounts: {
            blog: [],
            social: [],
            video: []
        },
        usersForm: new AppForm(App.forms.usersForm),
        /* tabs */
        tabs: [
            {name: 'blog accounts', component: 'blog-accounts', icon: 'fa-newspaper-o', iconColor: 'amber lighten-2', accounts:[]},
            {name: 'social accounts', component: 'social-accounts', icon: 'fa-address-book', iconColor: 'cyan',accounts:[]},
            {name: 'video accounts', component: 'video-accounts', icon: 'fa-youtube-play ', iconColor: 'red darken-4',accounts:[]}
        ],
        active: {
            name: 'blog accounts'
        }
    }),
    computed: {
        ...mapGetters({
            getMe: 'getMe'
        }) 
    },
    created () {
        this.getAccountsByType('blog')
        this.getAccountsByType('social')
        this.getAccountsByType('video')
    },
    mounted(){
        this.providerCallback()
    },
    methods: {
        async getAccountsByType(type='') {
            let self = this

            await axios.post(`/api/accounts/${type}`).then(({data}) => {
                if(type === 'blog'){
                    self.accounts.blog = data.data
                    self.tabs[0].accounts = data.data
                }   
                else if(type === 'social'){
                    self.accounts.social = data.data
                    self.tabs[1].accounts = data.data
                }
                else if(type === 'video'){
                    self.accounts.video = data.data
                    self.tabs[2].accounts = data.data
                } else{
                    console.log('index')
                }
            })
            
        },
        providerCallback(){
            let self = this
            self.usersForm.id = self.getMe.id
            /* dynamically generate query passed in Form Object */
            let data = self.query
            for (let k in data) {
                if (data.hasOwnProperty(k)) {
                    self.usersForm[k] = data[k];
                }
            }
            let provider = {provider: self.provider}
            App.post(route('api.provider.callback',provider),self.usersForm)
                .then((response) => {
                    console.log(response)
                    //! Activate the New User
                    //! first find by account_id 
                    // self.accounts.social

                //! find by provider_id
                })
        }
    }
}
</script>
