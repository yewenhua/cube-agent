<template>
    <div class="center-page">
        <div class="header">
            <div class="left">
                <img :src="header_img"/>
            </div>
            <div class="middle">
                <div class="name">叶文华</div>
                <div class="address">浙江省温州市瓯海区</div>
            </div>
            <div class="right">
                <img :src="agent_img"/>
                <div class="agent">代理</div>
            </div>
        </div>
        <div class="announce">这里有什么公告信息可以显示了</div>
        <div class="o-content">
            <div class="o-title">
                <div class="left">我的订单</div>
                <div class="right">总共{{data ? data.all : 0}}单</div>
            </div>
            <div class="o-slide">
                <cube-slide ref="slide" :data="items" @change="changePage" :auto-play="false">
                    <cube-slide-item v-for="(item, index) in items" :key="index" @click.native="clickHandler(item, index)" class="item">
                        <div v-for="(itm, idx) in item" :key="idx" class="single">
                            <router-link :to="{ name: itm.url, params: { type: itm.type }}">
                                <img :src="itm.image">
                                <div class="name">{{itm.name}}</div>
                            </router-link>
                        </div>
                    </cube-slide-item>
                </cube-slide>
            </div>
        </div>
        <div class="unbind">
            <cube-button :primary="true" @click="unbind">解除绑定</cube-button>
        </div>
    </div>
</template>
<script>
    import Vue from 'vue'
    import {
        Loading,
        Slide,
        Button,
        Dialog,
        Toast,
        Style
    } from 'cube-ui'

    Vue.use(Loading);
    Vue.use(Slide);
    Vue.use(Button);
    Vue.use(Toast);
    Vue.use(Dialog);
    Vue.use(Style);

    export default {
        data () {
            return {
                data: null,
                loading: false,
                items: [
                    [
                        {
                            name: '待确认',
                            url: 'list',
                            type: 'CREATED',
                            image: require('../assets/img/wait-confirm.png')
                        },
                        {
                            name: '待安装',
                            url: 'list',
                            type: 'ACCEPTED',
                            image: require('../assets/img/wait-install.png')
                        },
                        {
                            name: '已安装',
                            url: 'list',
                            type: 'FIXED',
                            image: require('../assets/img/already-install.png')
                        },
                        {
                            name: '已完成',
                            url: 'wechat',
                            type: 'FINISHED',
                            image: require('../assets/img/already-complete.png')
                        },
                        {
                            name: '退货中',
                            url: 'wechat',
                            type: 'REJECTING',
                            image: require('../assets/img/fefunding.png')
                        }
                    ],
                    [
                        {
                            name: '已关闭',
                            url: 'list',
                            type: 'CLOSED',
                            image: require('../assets/img/wait-confirm.png')
                        }
                    ],
                ],
                header_img: require('../assets/img/sns_icon_8.png'),
                agent_img: require('../assets/img/agent.png'),
            }
        },
        methods:{
            changePage(current) {

            },
            clickHandler(item, index) {

            },
            unbind(){
                let that = this;
                that.$createDialog({
                    type: 'confirm',
                    icon: 'cubeic-alert',
                    title: '解除绑定',
                    content: '确定解除绑定微信吗？',
                    confirmBtn: {
                        text: '确定',
                        active: true,
                        disabled: false,
                        href: 'javascript:;'
                    },
                    cancelBtn: {
                        text: '取消',
                        active: false,
                        disabled: false,
                        href: 'javascript:;'
                    },
                    onConfirm: () => {
                        that.sbCancel();
                    },
                    onCancel: () => {}
                }).show()
            },
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
            getAgent(){
                if(!this.loading) {
                    this.showToastLoading();
                    this.loading = true;
                    this.axios({
                        method: 'get',
                        url: '/agent/currentAgent',
                        params: {

                        },
                    }).then(function (response) {
                        this.hideToastLoading();
                        this.init = true;
                        this.loading = false;
                        if (response.status == 200 && response.data.code == 0) {
                            this.isbind = true;
                            this.mobile = response.data.data.username;
                            this.getData();
                        }
                    }.bind(this)).catch(function (error) {
                        this.hideToastLoading();
                        this.showToastMsg('warn', '获取失败');
                        this.init = true;
                        this.loading = false;
                    }.bind(this));
                }
            },
            getData(){
                if(!this.loading) {
                    this.showToastLoading();
                    this.loading = true;
                    this.axios({
                        method: 'get',
                        url: '/agent/order/statistics',
                        data: {
                            pageNumber: 1,
                            pageSize: 10,
                            orderStatus: ''
                        },
                    }).then(function (response) {
                        this.hideToastLoading();
                        this.loading = false;
                        if (response.status == 200 && response.data.code == 0) {
                            this.data = response.data.data;
                        }
                        else if (response.status == 200 && response.data.code == 3301) {
                            location.href= "/agent/redirect/index";
                        }
                    }.bind(this)).catch(function (error) {
                        this.hideToastLoading();
                        this.showToastMsg('warn', '获取失败');
                        this.loading = false;
                    }.bind(this));
                }
            },
            sbCancel(){
                if(!this.loading) {
                    this.showToastLoading();
                    this.loading = true;
                    this.axios({
                        method: 'post',
                        url: '/agent/unbind',
                        data: {

                        }
                    }).then(function (response) {
                        this.loading = false;
                        if (response.status == 200 && response.data.code == 0) {
                            this.showToastMsg('correct', '解除成功');
                            setTimeout(()=>{
                                location.href= "/agent/redirect/index";
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
            document.title = '代理商';
            this.getAgent();
        }
    }
</script>
<style scoped="scoped">
    .center-page{
        position: relative;
    }
    .header{
        height: 0.9rem;
        width: 100%;
        display: flex;
        flex-direction: row;
        padding-left: 0.15rem;
        padding-right: 0.15rem;
        box-sizing: border-box;
        align-items: center;
        background-image: linear-gradient(0deg, #2C333C 0%, #2B323D 100%);
    }
    .announce{
        background: #FFF3D6;
        margin-bottom: 0.1rem;
        height: 0.38rem;
        line-height: 0.38rem;
        padding-left: 0.15rem;
        box-shadow: inset 0 -0.01rem 0 0 rgba(206,206,206,0.50);
        font-family: PingFangSC-Regular;
        font-size: 0.12rem;
        color: #A7873E;
    }
    .o-content{
        width: 100%;
        height: 1.28rem;
        background: white;
        box-shadow: inset 0 -0.01rem 0 0 rgba(206,206,206,0.50);
    }
    .o-title{
        width: 100%;
        height: 0.38rem;
        display: flex;
        flex-direction: row;
        background: #FFFFFF;
        box-shadow: inset 0 -0.01rem 0 0 rgba(206,206,206,0.30);
    }
    .o-title .left{
        text-align: left;
        width: 50%;
        height: 100%;
        font-family: PingFangSC-Medium;
        font-size: 0.14rem;
        color: rgba(51,51,51,0.80);
        display: flex;
        align-items: center;
        padding-left: 0.15rem;
        box-sizing: border-box;
        font-weight: bold;
    }
    .o-title .right{
        width: 50%;
        height: 100%;
        ont-family: PingFangSC-Regular;
        font-size: 0.12rem;
        color: rgba(51,51,51,0.80);
        display: flex;
        align-items: center;
        justify-content: flex-end;
        box-sizing: border-box;
        padding-right: 0.15rem;
    }
    .o-slide{
        width: 100%;
        height: 0.9rem;
        padding-bottom: 0.02rem;
        box-sizing: border-box;
    }
    .item{
        display: flex;
        flex-direction: row;
        padding-left: 0.15rem;
        padding-right: 0.15rem;
        box-sizing: border-box;
    }
    .single{
        width: 25%;
        height: 100%;
    }
    .single a{
        height: 100%;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        text-decoration: none;
        flex-direction: column;
        flex-wrap: wrap;
    }
    .single img{
        max-width: 0.28rem;
        max-height: 0.28rem;
        display: block;
    }
    .single a .name{
        font-family: PingFangSC-Regular;
        font-size: 0.12rem;
        color: rgba(108,108,108,0.80);
    }
    .unbind{
        position: absolute;
        left: 0rem;
        bottom: 0rem;
        width: 100%;
        height: 0.6rem;
        padding-right: 0.15rem;
        padding-bottom: 0.15rem;
        padding-left: 0.15rem;
        box-sizing: border-box;
    }
    .unbind .cube-btn{
        width: 100%;
        height: 100%;
        padding: 0;
        font-size:  0.16rem;
    }
    .header .left{
        width: 0.48rem;
        height: 0.48rem;
    }
    .header .middle{
        padding-left: 0.15rem;
        width: calc( 100% - 1rem);
    }
    .header .right{
        width: 0.52rem;
    }
    .header .left img{
        height: 100%;
        width: 100%;
        border-radius: 50%;
        border: 0.01rem solid white;
        display: block;
    }
    .header .middle .name{
        font-family: PingFangSC-Regular;
        font-size: 0.16rem;
        color: #FFFFFF;
        margin-bottom: 0.08rem;
    }
    .header .middle .address{
        font-family: PingFangSC-Regular;
        font-size: 0.12rem;
        color: rgba(255,255,255,0.80);
    }
    .header .right img{
        display: block;
        width: 0.52rem;
    }
    .header .right .agent{
        font-family: PingFangSC-Regular;
        font-size: 0.1rem;
        color: rgba(255,255,255,0.80);
        text-align: center;
        margin-top: 0.08rem;
    }
</style>