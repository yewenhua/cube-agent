<template>
    <div class="o-detail-page">
        <div class="header" v-if="data">
            <div class="inner">
                <div class="left">
                    <img :src="status_img"/>
                </div>
                <div class="right">
                    <div class="status" v-if="data">订单{{data.orderStatusName}}</div>
                    <div class="time" v-if="data && !data.fixDate">预约时间：{{data.appointmentDate.substring(0, 16)}}</div>
                    <div class="time" v-if="data && data.fixDate">安装时间：{{data.fixDate.substring(0, 16)}}</div>
                </div>
            </div>
        </div>
        <cube-scroll v-if="data" ref="scroll" class="scroll-content" :data="data">
            <div class="inner-content">
                <div class="d-content">
                    <div class="item customer" :class="customerContent ? 'active' : ''">
                        <div class="title" @click="hideContent('customer')"><img :src="list_img"/>客户信息</div>
                        <div class="item-content">
                            <div class="inner-item">
                                <div class="i-left">预约客户：</div>
                                <div class="i-right">{{data && data.receiver ? data.receiver : ''}}</div>
                            </div>
                            <div class="inner-item">
                                <div class="i-left">预约手机：</div>
                                <div class="i-right">{{data && data.mobile ? data.mobile : ''}}</div>
                            </div>
                            <div class="inner-item">
                                <div class="i-left">预约时间：</div>
                                <div class="i-right">{{data && data.appointmentDate ? data.appointmentDate.substring(0, 16) : ''}}</div>
                            </div>
                            <div class="inner-item">
                                <div class="i-left">安装时间：</div>
                                <div class="i-right">{{data && data.fixDate ? data.fixDate.substring(0, 16) : '未安装'}}</div>
                            </div>
                            <div class="inner-item">
                                <div class="i-left">安装地址：</div>
                                <div class="i-right">{{data && data.address ? data.address : ''}}</div>
                            </div>
                        </div>
                    </div>
                    <div class="item product" :class="productContent ? 'active' : ''">
                        <div class="title" @click="hideContent('product')"><img :src="list_img"/>预约产品</div>
                        <div class="item-content">
                            <div class="inner-item img-item">
                                <div class="i-left">产品图片：</div>
                                <div class="i-right">
                                    <div class="img" @click="imgPreview('product', 0)" v-if="data && data.proImg">
                                        <img :src="data.proImg"/>
                                    </div>
                                </div>
                            </div>
                            <div class="inner-item">
                                <div class="i-left">产品名称：</div>
                                <div class="i-right">{{data && data.goodsName ? data.goodsName : ''}}</div>
                            </div>
                            <div class="inner-item">
                                <div class="i-left">产品型号：</div>
                                <div class="i-right">{{data && data.goodsSpec ? data.goodsSpec : ''}}</div>
                            </div>
                            <div class="inner-item">
                                <div class="i-left">产品颜色：</div>
                                <div class="i-right">{{data && data.goodsCode ? data.goodsCode : ''}}</div>
                            </div>
                            <div class="inner-item">
                                <div class="i-left">序列号：</div>
                                <div class="i-right">{{data && data.goodsSn ? data.goodsSn : '--'}}</div>
                            </div>
                            <div class="inner-item img-item">
                                <div class="i-left">导向板：</div>
                                <div class="i-right">
                                    <div class="img" @click="imgPreview('dxb', 0)" v-if="data && data.dxbImg">
                                        <img :src="data.dxbImg"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="item comment" :class="commentContent ? 'active' : ''" v-if="data && data.attitudeScore">
                        <div class="title" @click="hideContent('comment')"><img :src="list_img"/>客户评价</div>
                        <div class="item-content">
                            <div class="inner-item">
                                <div class="i-left withimg">产品评价：</div>
                                <div class="i-right"><Star :point="data && data.productScore ? data.productScore : 0" :edit="false"></Star></div>
                            </div>
                            <div class="inner-item withimg">
                                <div class="i-left">安装响应：</div>
                                <div class="i-right"><Star :point="data && data.promptScore ? data.promptScore : 0" :edit="false"></Star></div>
                            </div>
                            <div class="inner-item withimg">
                                <div class="i-left">服务态度：</div>
                                <div class="i-right"><Star :point="data && data.attitudeScore ? data.attitudeScore : 0" :edit="false"></Star></div>
                            </div>
                            <div class="inner-item">
                                <div class="i-left">评价内容：</div>
                                <div class="i-right mutil-line">{{data && data.commentContent ? data.commentContent : '--'}}</div>
                            </div>
                            <div class="inner-item img-item">
                                <div class="i-left">评价图片：</div>
                                <div class="i-right">
                                    <div class="img" @click="imgPreview('comment', index)" v-for="(item, index) in data.imgs" :key="index" v-if="data && data.imgs.length > 0">
                                        <img :src="item"/>
                                    </div>
                                    <div v-if="data && data.imgs.length == 0">--</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="item refund last" :class="refundContent ? 'active' : ''" v-if="data && (data.orderStatus == 'REJECTING' || data.orderStatus == 'CLOSED' && data.rejectReason)">
                        <div class="title" @click="hideContent('refund')"><img :src="list_img"/>退货信息</div>
                        <div class="item-content">
                            <div class="inner-item">
                                <div class="i-left">退货状态：</div>
                                <div class="i-right">{{data && data.rejectStatusName ? data.rejectStatusName : '--'}}</div>
                            </div>
                            <div class="inner-item">
                                <div class="i-left">退货说明：</div>
                                <div class="i-right mutil-line">{{data && data.rejectReason ? data.rejectReason : '--'}}</div>
                            </div>
                            <div class="inner-item">
                                <div class="i-left">申请时间：</div>
                                <div class="i-right">{{data && data.rejectApplyDate ? data.rejectApplyDate.substring(0,16) : '--'}}</div>
                            </div>
                            <div class="inner-item">
                                <div class="i-left">处理时间：</div>
                                <div class="i-right">{{data && data.rejectFinishDate ? data.rejectFinishDate.substring(0,16) : '--'}}</div>
                            </div>
                            <div class="inner-item img-item">
                                <div class="i-left">评价图片：</div>
                                <div class="i-right">
                                    <div class="img" @click="imgPreview('refund', index)" v-for="(item, index) in data.rejectImgs" :key="index" v-if="data && data.rejectImgs.length > 0">
                                        <img :src="item"/>
                                    </div>
                                    <div v-if="data && data.rejectImgs.length == 0">--</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="scan">
                    <cube-input v-model="sn" class="scan-input" placeholder="请扫描条码ID"></cube-input>
                    <img :src="scan_img"/>
                </div>

                <div class="back">
                    <cube-button :primary="true" @click="backHome">返回首页</cube-button>
                </div>
            </div>
        </cube-scroll>

        <div v-if="!data && !loading" class="nodata">
            <img :src="nodata_img"/>
            <div class="notxt">亲，没有数据</div>
        </div>
    </div>
</template>
<script>
    import Vue from 'vue'
    import {
        Loading,
        Button,
        Toast,
        Style,
        Scroll,
        Input,
        ImagePreview
    } from 'cube-ui'
    import Star from './Star.vue'
    import { mapState } from 'vuex'

    Vue.use(Loading);
    Vue.use(Button);
    Vue.use(Toast);
    Vue.use(Input);
    Vue.use(Scroll);
    Vue.use(Style);
    Vue.use(ImagePreview);

    export default {
        computed: {
            ...mapState([
                'baseURL'
            ])
        },
        data () {
            return {
                scroll: null,
                customerContent: true,
                productContent: true,
                commentContent: true,
                refundContent: true,
                loading: false,
                example_img: require('../assets/img/color-wait-confirm.png'),
                nodata_img: require('../assets/img/nodata.png'),
                list_img: require('../assets/img/list.png'),
                status_img: require('../assets/img/color-wait-confirm.png'),
                home_img: require('../assets/img/home_fill.png'),
                scan_img: require('../assets/img/scan.png'),
                initialIndex: 0,
                id: null,
                sn: '',
                wxinit: false,
                data: null,
                imgs: []
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
            hideContent(type){
                let that = this;
                if(type == 'customer'){
                    that.customerContent = !that.customerContent;
                }
                else if(type == 'product'){
                    that.productContent = !that.productContent;
                }
                else if(type == 'comment'){
                    that.commentContent = !that.commentContent;
                }
                else if(type == 'refund'){
                    that.refundContent = !that.refundContent;
                }
                setTimeout(()=>{
                    that.$refs.scroll.refresh();
                }, 400);
            },
            imgPreview(type, index){
                if(type == 'product'){
                    this.imgs = [
                        this.data.proImg
                    ];
                }
                else if(type == 'comment'){
                    this.imgs = this.data.imgs;
                }
                else if(type == 'refund'){
                    this.imgs = this.data.rejectImgs;
                }
                else if(type == 'dxb'){
                    this.imgs = [
                        this.data.dxbImg
                    ];
                }

                this.initialIndex = index;
                const params = {
                    $props: {
                        imgs: this.imgs,
                        initialIndex: 'initialIndex', // 响应式数据的key名
                        loop: false
                    },
                    $events: {
                        change: (i) => {
                            // 必须更新 initialIndex
                            this.initialIndex = i;
                        }
                    }
                }
                this.$createImagePreview({ ...params }).show();
            },
            backHome(){
                this.$router.push({ path: '/app/center' })
            },
            getData(cb){
                if(!this.loading) {
                    this.showToastLoading();
                    this.loading = true;
                    this.axios({
                        method: 'get',
                        url: '/agent/order/detail/' + this.id,
                        params: {

                        },
                    }).then(function (response) {
                        this.hideToastLoading();
                        this.loading = false;
                        if (response.status == 200 && response.data.code == 0) {
                            let arr = [];
                            if(response.data.data.commentImages && response.data.data.commentImages.indexOf(',') != -1){
                                let tmp = response.data.data.commentImages.split(',');
                                for (let i = 0; i < tmp.length; i++){
                                    let img = this.cmtImg(tmp[i]);
                                    arr.push(img);
                                }
                            }
                            else if(response.data.data.commentImages){
                                let img = this.cmtImg(response.data.data.commentImages);
                                arr.push(img);
                            }
                            response.data.data.imgs = arr;

                            let rejectArr = [];
                            if(response.data.data.rejectImage && response.data.data.rejectImage.indexOf(',') != -1){
                                let tmp = response.data.data.rejectImage.split(',');
                                for (let i = 0; i < tmp.length; i++){
                                    let rejectImgs = this.rejectImg(tmp[i]);
                                    rejectArr.push(rejectImgs);
                                }
                            }
                            else if(response.data.data.rejectImage){
                                let img = this.rejectImg(response.data.data.rejectImage);
                                rejectArr.push(img);
                            }
                            response.data.data.rejectImgs = rejectArr;

                            response.data.data.proImg = this.getImg('main', response.data.data.goodsImage);
                            response.data.data.dxbImg = response.data.data.directorImage ? this.dxbImg(response.data.data.directorImage) : '';

                            this.data = response.data.data;
                            if(response.data.data.orderStatus == 'CREATED'){
                                this.status_img = require('../assets/img/color-wait-confirm.png');
                            }
                            else if(response.data.data.orderStatus == 'ACCEPTED'){
                                this.status_img = require('../assets/img/color-wiat-install.png');
                            }
                            else if(response.data.data.orderStatus == 'FINISHED'){
                                this.status_img = require('../assets/img/color-complete.png');
                            }
                            else{
                                this.status_img = require('../assets/img/refund.png');
                            }

                            cb();
                        }
                        else if (response.status == 200 && response.data.code == 3301) {
                            cb();
                            location.href= "/agent/redirect/index";
                        }
                        else {
                            cb();
                            this.showToastMsg('warn', response.data.msg);
                        }
                    }.bind(this)).catch(function (error) {
                        cb();
                        this.hideToastLoading();
                        this.loading = false;
                        this.showToastMsg('warn', '获取失败');
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
            dxbImg(img){
                return this.baseURL + '/agent/order/directorImage/' + img;
            },
            cmtImg(img){
                return this.baseURL + '/agent/comment/commentImage/' + img;
            },
            rejectImg(img){
                return this.baseURL + '/agent/reject/rejectImage/' + img;
            },
            confirm(){
                if(!this.loading) {
                    this.showToastLoading();
                    this.loading = true;
                    this.axios({
                        method: 'post',
                        url: '/agent/order/accept/' + this.id,
                        data: {
                            id: this.id
                        }
                    }).then(function (response) {
                        this.hideToastLoading();
                        this.loading = false;
                        if (response.status == 200 && response.data.code == 0) {
                            this.showToastMsg('correct', '提交成功');
                            setTimeout(()=>{
                                location.reload();
                            }, 1500);
                        }
                        else if (response.status == 200 && response.data.code == 3301) {
                            location.href= "/agent/redirect/index";
                        }
                        else {
                            this.showToastMsg('warn', response.data.ms);
                        }
                    }.bind(this)).catch(function (error) {
                        this.hideToastLoading();
                        this.loading = false;
                        this.showToastMsg('warn', '未知错误');
                    }.bind(this));
                }
            },
            complete(){
                if(!this.loading) {
                    this.showToastLoading();
                    this.loading = true;
                    this.axios({
                        method: 'post',
                        url: '/agent/order/fix',
                        data: {
                            id: this.id,
                            sn: this.sn
                        }
                    }).then(function (response) {
                        this.hideToastLoading();
                        this.loading = false;
                        if (response.status == 200 && response.data.code == 0) {
                            this.showToastMsg('correct', '提交成功');
                            setTimeout(()=>{
                                location.reload();
                            }, 1500);
                        }
                        else if (response.status == 200 && response.data.code == 3301) {
                            location.href= "/agent/redirect/index";
                        }
                        else {
                            this.showToastMsg('warn', response.data.ms);
                        }
                    }.bind(this)).catch(function (error) {
                        this.hideToastLoading();
                        this.loading = false;
                        this.showToastMsg('warn', '未知错误');
                    }.bind(this));
                }
            },
            refund(){
                if(!this.loading) {
                    this.showToastLoading();
                    this.loading = true;
                    this.axios({
                        method: 'post',
                        url: '/agent/reject/finish/' + this.data.rejectId,
                        data: {
                            id: this.data.rejectId
                        }
                    }).then(function (response) {
                        this.hideToastLoading();
                        this.loading = false;
                        if (response.status == 200 && response.data.code == 0) {
                            this.showToastMsg('correct', '提交成功');
                            setTimeout(()=>{
                                location.reload();
                            }, 1500);
                        }
                        else if (response.status == 200 && response.data.code == 3301) {
                            location.href= "/agent/redirect/index";
                        }
                        else {
                            this.showToastMsg('warn', response.data.ms);
                        }
                    }.bind(this)).catch(function (error) {
                        this.hideToastLoading();
                        this.loading = false;
                        this.showToastMsg('warn', '未知错误');
                    }.bind(this));
                }
            },
            sign(){
                this.axios({
                    method: 'get',
                    url: '/agent/wxConfig',
                    params: {
                        url: location.href.split('#')[0]
                    },
                }).then(function (response) {
                    if (response.status == 200 && response.data.code == 0) {
                        this.init(response.data.data);
                    }
                    else if (response.status == 200 && response.data.code == 3301) {
                        location.href= "/agent/redirect/index";
                    }
                }.bind(this)).catch(function (error) {

                }.bind(this));
            },
            scan(){
                var that = this;
                if(that.wxinit) {
                    wx.scanQRCode({
                        needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                        scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
                        success: function (res) {
                            var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
                            if(result.indexOf(',') !== -1){
                                result = result.split(',')[1]
                            }

                            that.sn = result;
                        }
                    });
                }
                else{
                    that.showToastMsg('warn', '微信初始化失败');
                }
            },
            init(data){
                var that = this;
                if(typeof WeixinJSBridge == "undefined"){
                    if(document.addEventListener){
                        document.addEventListener('WeixinJSBridgeReady', wechat, false);
                    }
                    else if(document.attachEvent){
                        document.attachEvent('WeixinJSBridgeReady', wechat);
                        document.attachEvent('onWeixinJSBridgeReady', wechat);
                    }
                }
                else{
                    wechat();
                }

                function wechat(){
                    wx.config({
                        debug:false,
                        signature: data.signature,
                        appId: data.appId,
                        timestamp: data.timestamp,
                        nonceStr: data.nonceStr,
                        jsApiList: ['scanQRCode'],
                    });
                    wx.ready(function(){
                        that.wxinit = true;
                    });
                    wx.error(function(res){
                        that.wxinit = false;
                    });
                }
            }
        },
        components: {
            Star
        },
        mounted() {
            document.title = '订单详情';
            let that = this;
            that.id = that.$route.params.id;
            that.getData(()=>{
                this.$refs.scroll && this.$refs.scroll.forceUpdate();
            });
        }
    }
</script>
<style scoped="scoped">
    .o-detail-page{

    }
    .header{
        height: 1.12rem;
        width: 100%;
        background-image: linear-gradient(90deg, #2C333C 0%, #2B323D 100%);
    }
    .inner{
        height: 0.8rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .inner .left{
        width: 30%;
        display: flex;
        align-items: center;
        justify-content: flex-end;
    }
    .inner .right{
        width: 70%;
        display: flex;
        align-items: flex-start;
        justify-content: center;
        flex-wrap: wrap;
        flex-direction: column;
        padding-left: 0.16rem;
    }
    .inner .left img{
        height: 0.38rem;
        width: 0.38rem;
    }
    .inner .right .status{
        font-family: PingFangSC-Medium;
        font-size: 0.16rem;
        color: #FFFFFF;
        margin-bottom: 0.03rem;
    }
    .inner .right .time{
        font-family: PingFangSC-Medium;
        font-size: 0.12rem;
        color: rgba(255,255,255,0.74);
    }
    .scroll-content{
        height: 100%;
        width: 100%;
        position: absolute;
        left: 0;
        top: 0;
    }
    .inner-content{
        padding-top: 0.8rem;
        box-sizing: border-box;
    }
    .d-content{
        margin-left: 0.15rem;
        margin-right: 0.15rem;
        border-radius: 4px;
        position: relative;
        box-shadow: 0 2px 4px 0 rgba(0,0,0,0.20);
    }
    .d-content .item{
        width: 100%;
        background: white;
        position: relative;
    }
    .d-content .item.customer{
        border-radius: 4px 4px 0px 0px;
    }
    .d-content .item.last{
        border-radius: 0px 0px 4px 4px;
    }
    .d-content .item .title{
        background: #92A1BE;
        font-family: PingFangSC-Medium;
        font-size: 0.12rem;
        color: #FFFFFF;
        height: 0.32rem;
        width: 100%;
        display: flex;
        align-items: center;
        padding-left: 0.15rem;
        box-sizing: border-box;
    }
    .d-content .item.customer .title{
        background-image: linear-gradient(-180deg, #1581FF 0%, #5CA7FF 100%);
        border-radius: 4px 4px 0px 0px;
    }
    .d-content .item .title img{
        width: 0.16rem;
        height: 0.16rem;
        margin-right: 0.1rem;
        position: relative;
    }
    .back{
        width: 100%;
        height: 0.6rem;
        padding-right: 0.15rem;
        padding-left: 0.15rem;
        box-sizing: border-box;
        position: relative;
        margin-top: 0.1rem;
    }
    .back .cube-btn{
        width: 100%;
        height: 0.45rem;
        padding: 0rem;
        font-size:  0.16rem;
    }
    .back .cube-btn-primary {
        background: rgba(43,153,255,0.8);
    }
    .back:active .cube-btn-primary {
        background: rgba(43,153,255,1);
    }
    .item-content{
        height: 0rem;
        transition: height 0.3s;
        overflow: hidden;
    }
    .d-content .item:after{
        content: '';
        position: absolute;
        right: 0.15rem;
        top: 0.1rem;
        width: 0.06rem;
        height: 0.06rem;
        border-right: 0.01rem solid white;
        border-bottom: 0.01rem solid white;
        transform: rotate(-45deg);
        transition: all 0.3s;
    }
    .d-content .item.active:after{
        transform: rotate(45deg);
    }
    .d-content .item.active .item-content{
        height: 1.7rem;
    }
    .d-content .item.product.active .item-content{
        height: 2.23rem;
    }
    .d-content .item.comment.active .item-content{
        height: auto;
    }
    .d-content .item.refund.active .item-content{
        height: auto;
    }
    .inner-item{
        padding: 0.02rem .15rem;
        display: flex;
        flex-direction: row;
        font-size: 0.14rem;
        box-sizing: border-box;
        line-height: 0.26rem;
    }
    .inner-item.img-item{
        height: 0.4rem;
        align-items: center;
        padding-top: 0.04rem;
        padding-bottom: 0.03rem;
    }
    .i-left{
        width: 0.7rem;
        color: #8B8B8B;
        text-align: right;
    }
    .i-right{
        width: calc( 100% - 0.7rem);
        color: #555555;
    }
    .inner-item.img-item .i-right{
        display: flex;
        flex-direction: row;
        align-items: center;
    }
    .inner-item .img{
        width: calc( 20% - 0.1rem);
        box-sizing: border-box;
        margin-right: 0.1rem;
        max-height: 100%;
    }
    .inner-item .img img{
        width: 100%;
        display: block;
    }
    .i-left.withimg, .i-right.withimg{
        display: flex;
        align-items: center;
    }
    .item-content .inner-item:first-child{
        margin-top: 0.1rem;
    }
    .item-content .inner-item:last-child{
        margin-bottom: 0.1rem;
    }
    .mutil-line{
        overflow : hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
    }
    .gohome{
        position: absolute;
        right: 0.2rem;
        top:0.2rem;
        width: 0.3rem;
        height:0.3rem;
        z-index: 9998;
    }
    .gohome img{
        width: 0.3rem;
        height:0.3rem;
        display: block;
    }
    .scan{
        padding: 0.1rem 0.15rem;
        margin-top: 0.1rem;
        position: relative;
    }
    .scan .cube-input::after{
        border-color: #D5D9E1;
        border-radius: 0.04rem;
        border-width: 0.02rem;
        box-shadow: 0 0.02rem 0.04rem 0 rgba(0,0,0,0.20);
    }
    .scan .cube-input.cube-input_active::after{
        border-color: #D5D9E1;
    }
    .scan img{
        position: absolute;
        right: 0.25rem;
        top: 50%;
        transform: translateY(-50%);
        height: 0.3rem;
    }
</style>