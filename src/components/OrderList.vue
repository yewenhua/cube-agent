<template>
    <div class="o-list-page">
        <cube-scroll ref="scroll" class="scroll-content" :options="options" :data="datalist" @pulling-down="onPullingDown" @pulling-up="onPullingUp" v-if="datalist.length > 0">
            <div class="inner-content">
                    <ul>
                        <router-link :to="{ name:'detail', params: { id: item.id }}" v-for="(item, index) in datalist" :key="index">
                            <li>
                                <div class="left">
                                    <img :src="item.img"/>
                                </div>
                                <div class="right">
                                    <div class="item">产品型号： {{item.goodsName}}</div>
                                    <div class="item">联系方式： {{item.mobile}}</div>
                                    <div class="item">预约时间： {{item.appointmentDate.substring(0, 16)}}</div>
                                </div>
                            </li>
                        </router-link>
                    </ul>
                </div>
        </cube-scroll>
        <div v-if="datalist.length == 0 && !loading" class="nodata">
            <img :src="nodata_img"/>
            <div class="notxt">亲，没有数据</div>
        </div>
        <div class="search">
            <cube-button :primary="true" @click="showPopup">搜索订单（{{totalCount}}单）</cube-button>
        </div>
        <cube-popup type="my-popup" position="bottom" :mask-closable="true" ref="myPopup">
            <div class="search-wrapper">
                <div class="search-title">请输入搜索关键字</div>
                <cube-input v-model="searchkey" class="search-input" placeholder="姓名、手机号码、订单号"></cube-input>
                <div class="serrch-btn">
                    <div class="left">
                        <cube-button :primary="true" @click="reset">重置搜索</cube-button>
                    </div>
                    <div class="right">
                        <cube-button :primary="true" @click="search">确认提交</cube-button>
                    </div>
                </div>
            </div>
        </cube-popup>
    </div>
</template>
<script>
    import Vue from 'vue'
    import {
        Loading,
        Button,
        Toast,
        Style,
        Input,
        Scroll,
        Popup
    } from 'cube-ui'
    import { mapState } from 'vuex'

    Vue.use(Loading);
    Vue.use(Button);
    Vue.use(Toast);
    Vue.use(Style);
    Vue.use(Input);
    Vue.use(Scroll);
    Vue.use(Popup);

    export default {
        computed: {
            ...mapState([
                'baseURL'
            ])
        },
        data () {
            return {
                scroll: null,
                datalist: [],
                pageNumber: 1,
                pageSize: 10,
                totalPage: 1,
                totalCount: 0,
                options: {
                    pullDownRefresh: {
                        txt: '刷新中…'
                    },
                    pullUpLoad: {
                        txt: {
                            more: '加载更多',
                            noMore: '我是有底线的'
                        }
                    }
                },
                nodata_img: require('../assets/img/nodata.png'),
                searchkey: '',
                type: 'CREATED',
                loading: false,
                popComponent: null
            }
        },
        methods: {
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
            showPopup() {
                this.popComponent = this.$refs.myPopup;
                this.popComponent.show();
            },
            hidePopup() {
                this.popComponent.hide();
            },
            getData(cb){
                if(!this.loading) {
                    this.showToastLoading();
                    this.loading = true;
                    this.axios({
                        method: 'get',
                        url: '/agent/order/page',
                        params: {
                            pageNumber: this.pageNumber,
                            pageSize: this.pageSize,
                            orderStatus: this.type,
                            text: this.searchkey
                        },
                    }).then(function (response) {
                        this.hideToastLoading();
                        this.loading = false;
                        if (response.status == 200 && response.data.code == 0) {
                            let oData = this.datalist;
                            for(let i=0; i<response.data.data.content.length; i++){
                                response.data.data.content[i].img = this.getImg('main', response.data.data.content[i].goodsImage)
                            }
                            let nData = oData.concat(response.data.data.content);
                            this.datalist = nData;
                            this.totalPage = response.data.data.pageCount;
                            this.totalCount = response.data.data.totalCount;
                        }
                        else if (response.status == 200 && response.data.code == 3301) {
                            cb();
                            location.href= "/agent/redirect/index";
                        }
                        else {
                            this.pageNumber = this.pageNumber - 1;
                            this.showToastMsg('warn', response.data.msg);
                            cb();
                        }
                    }.bind(this)).catch(function (error) {
                        this.hideToastLoading();
                        this.loading = false;
                        this.showToastMsg('warn', '获取失败');
                        this.pageNumber = this.pageNumber - 1;
                        cb();
                    }.bind(this));
                }
            },
            getImg(type, img){
                if(type == 'main') {
                    return this.baseURL + '/agent/goods/image/' + img + '?imageType=GOODS_IMAGE';
                }
                else{
                    return this.baseURL + '/agent/goods/image/' + img + '?imageType=GOODS_DETAIL';
                }
            },
            onPullingDown() {
                if(!this.loading) {
                    this.totalPage = 1;
                    this.pageNumber = 1;
                    this.datalist = [];
                    this.getData(() => {
                        this.$refs.scroll && this.$refs.scroll.forceUpdate();
                    });
                }
                else{
                    this.$refs.scroll && this.$refs.scroll.forceUpdate();
                }
            },
            onPullingUp() {
                if(this.pageNumber < this.totalPage && !this.loading){
                    this.pageNumber = this.pageNumber + 1;
                    this.getData(()=>{
                        this.$refs.scroll && this.$refs.scroll.forceUpdate();
                    });
                }
                else{
                    this.$refs.scroll && this.$refs.scroll.forceUpdate();
                }
            },
            search(){
                this.totalPage = 1;
                this.pageNumber = 1;
                this.datalist = [];
                this.hidePopup();
                this.getData(() => {
                    this.$refs.scroll && this.$refs.scroll.forceUpdate();
                });
            },
            reset(){
                this.searchkey = '';
                this.totalPage = 1;
                this.pageNumber = 1;
                this.datalist = [];
                this.hidePopup();
                this.getData(() => {
                    this.$refs.scroll && this.$refs.scroll.forceUpdate();
                });
            }
        },
        mounted() {
            document.title = '订单列表';
            let that = this;
            that.type = that.$route.params.type;
            that.getData(()=>{
                this.$refs.scroll && this.$refs.scroll.forceUpdate();
            });
        }
    }
</script>
<style scoped="scoped">
    .o-list-page{
        font-size: 0.14rem;
    }
    .scroll-content{
        height: 100%;
    }
    .inner-content{
        padding: 0.15rem;
        box-sizing: border-box;
        padding-bottom: 0rem;
    }
    .inner-content ul{
        margin: 0;
        padding: 0;
        list-style: none;
    }
    .inner-content ul li{
        background: white;
        box-shadow: inset 0 -0.01rem 0 0 rgba(206,206,206,0.50);
        border-radius: 0.05rem;
        margin-bottom: 0.06rem;
        position: relative;
        min-height: 0.8rem;
        width: 100%;
        display: flex;
        flex-direction: row;
    }
    .inner-content ul li:after{
        content: '';
        position: absolute;
        right: 0.15rem;
        top: 50%;
        width: 0.08rem;
        height: 0.08rem;
        border-right: 0.01rem solid #B2B2B2;
        border-bottom: 0.01rem solid #B2B2B2;
        transform: rotate(-45deg) translateY(-50%);
        transition: all 0.3s;
    }
    .inner-content ul li .left{
        width: 0.72rem;
        box-sizing: border-box;
        padding-left: 0.1rem;
        padding-right: 0.1rem;
        display: flex;
        align-items: center;
    }
    .inner-content ul li .right{
        width: calc( 100% - 0.65rem );
        padding: 0.1rem;
        box-sizing: border-box;
        display: flex;
        align-items: flex-start;
        flex-direction: column;
        justify-content: center;
        padding-left: 0.15rem;
    }
    .inner-content ul li .left img{
        box-shadow: 0 0.02rem 0.04rem 0 rgba(0,0,0,0.14);
        border-radius: 0.04rem;
        display: block;
        max-height: 100%;
        max-width: 100%;
    }
    .inner-content ul li .right .item{
        font-family: PingFangSC-Regular;
        font-size: 0.12rem;
        color: rgba(51,51,51,0.80);
        line-height: 0.2rem;
        letter-spacing: 0;
    }
    .search{
        position: absolute;
        left: 0rem;
        bottom: 0rem;
        z-index: 99;
        width: 100%;
        padding: 0rem 0.15rem;
        padding-bottom: 0.15rem;
        box-sizing: border-box;
    }
    .search .cube-btn{
        width: 100%;
        height: 0.45rem;
        line-height: 0.45rem;
        padding: 0rem;
        font-size:  0.16rem;
    }
    .search .cube-btn-primary {
        background: rgba(43,153,255,0.8);
    }
    .search:active .cube-btn-primary {
        background: rgba(43,153,255,1);
    }
    .search-wrapper{
        background: white;
        height: 1.3rem;
        padding: 0.15rem;
    }
    .search-title{
        font-family: PingFangSC-Regular;
        font-size: 0.12rem;
        color: #888888;
        margin-bottom: 0.08rem;
    }
    .search-input{
        height: 0.38rem;
        width: 100%;
        margin-bottom: 0.19rem;
        outline: 0;
    }
    .search-input.cube-input::after{
        border-color: #DFDFDF;
        border-radius: 0.04rem;
    }
    .search-input.cube-input_active::after{
        border-color: #fc9153;
    }
    .serrch-btn{
        width: 100%;
        display: flex;
        flex-direction: row;
    }
    .serrch-btn .left{
        width: 50%;
    }
    .serrch-btn .right{
        width: 50%;
    }
    .serrch-btn .left .cube-btn{
        width: 100%;
        height: 0.45rem;
        line-height: 0.45rem;
        padding: 0rem;
        font-size:  0.16rem;
        border-bottom-right-radius: 0rem;
        border-top-right-radius: 0rem;
    }
    .serrch-btn .left .cube-btn-primary {
        background: rgba(173,203,239,0.8);
    }
    .serrch-btn .left:active .cube-btn-primary {
        background: rgba(173,203,239,1);
    }
    .serrch-btn .right .cube-btn{
        width: 100%;
        height: 0.45rem;
        font-size:  0.16rem;
        border-top-left-radius: 0rem;
        border-bottom-left-radius: 0rem;
    }
    .serrch-btn .right .cube-btn-primary {
        background: rgba(126,173,228,0.8);
    }
    .serrch-btn .right:active .cube-btn-primary {
        background: rgba(126,173,228,1);
    }
</style>