<template>
    <div class="wechat-page">
        <div class="b-tip">
            <img :src="logo_img"/>
        </div>
        <div class="w-content">
            <cube-input v-model="mobile" class="bind-input" placeholder="请输入手机号码"></cube-input>
            <cube-input v-model="password" class="bind-input" placeholder="请输入密码"></cube-input>
        </div>
        <div class="bind">
            <cube-button :primary="true" @click="sbbind">绑定微信登录</cube-button>
        </div>
    </div>
</template>
<script>
    import Vue from 'vue'
    import {
        Loading,
        Button,
        Toast,
        Style
    } from 'cube-ui'

    Vue.use(Loading);
    Vue.use(Button);
    Vue.use(Toast);
    Vue.use(Style);

    export default {
        data () {
            return {
                logo_img: require('../assets/img/logo@2x.png'),
                password: '',
                mobile: '',
                loading: false,
                toast: null
            }
        },
        methods:{
            showToastLoading () {
                this.toast = this.$createToast({
                    txt: '加载中...',
                    mask: true
                })
                this.toast.show();
            },
            hideToastLoading (){
                this.toast.hide();
            },
            showToastMsg(type, msg){
                this.$createToast({
                    type: type,
                    time: 1000,
                    txt: msg
                }).show();
            },
            sbbind(){
                if(!this.mobile){
                    this.showToastMsg('warn', '手机号码不能为空');
                    return false;
                }
                if(!this.password){
                    this.showToastMsg('warn', '密码不能为空');
                    return false;
                }

                if(!this.loading) {
                    this.loading = true;
                    this.axios({
                        method: 'post',
                        url: '/agent/bind',
                        data: {
                            username: this.mobile,
                            password: this.password
                        }
                    }).then(function (response) {
                        this.loading = false;
                        if (response.status == 200 && response.data.code == 0) {
                            this.showToastMsg('correct', '绑定成功');
                            setTimeout(()=>{
                                this.$router.push({ path: '/app/center' });
                            }, 1500);
                        }
                        else if (response.status == 200 && response.data.code == 3301) {
                            location.href= "/agent/redirect/index";
                        }
                        else {
                            this.showToastMsg('warn', response.data.ms);
                        }
                    }.bind(this)).catch(function (error) {
                        this.loading = false;
                        this.showToastMsg('warn', '未知错误');
                    }.bind(this));
                }
            }
        },
        mounted(){
            document.title = '绑定微信';
        }
    }
</script>
<style scoped="scoped">
    .wechat-page{
        box-sizing: border-box;
        padding: 0.15rem;
    }
    .b-tip{
        font-family: PingFangSC-Regular;
        font-size: 0.12rem;
        color: #888888;
        margin-bottom: 0.08rem;
        text-align: center;
        display: flex;
        justify-content: center;
        padding-top: 0.3rem;
        padding-bottom: 0.3rem;
    }
    .b-tip img{
        width: 1.68rem;
        height: 0.8rem;
        display: block;
    }
    .w-content .cube-input::after{
        border: none;
        box-shadow: inset 0 -0.01rem 0 0 rgba(220,220,220,0.50);
    }
    .w-content .cube-input{
        margin-bottom: 0.2rem;
    }
    .bind{
        margin-top: 0.4rem;
    }
    .bind .cube-btn{
        width: 100%;
        height: 0.45rem;
        line-height: 0.45rem;
        padding: 0;
        font-size:  0.16rem;
    }
    .bind .cube-btn-primary {
        background: rgba(43,153,255,0.8);
    }
    .bind:active .cube-btn-primary {
        background: rgba(43,153,255,1);
    }
</style>