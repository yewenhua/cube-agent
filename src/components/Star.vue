<template>
    <div class="star-warper">
        <div class="start-content" v-for="(item, index) in stars" :key="index">
            <img class="star-image" :src="point > item ? (point-item == 0.5 ? half_img : selected_img) : normal_img"/>
            <div class="item"></div>
            <div class="item" style="left: 0.13rem;"></div>
        </div>
    </div>
</template>
<script>
    export default {
        props: {
            point: {
                type: Number,
                default: 0
            },
            edit: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                stars: [0, 1, 2, 3, 4],
                normal_img: require('../assets/img/normal.png'),
                selected_img: require('../assets/img/selected.png'),
                half_img: require('../assets/img/half.png')
            }
        },
        methods: {
            selectLeft(key) {
                if(this.edit) {
                    if (this.point == 0.5 && key == 0.5) {
                        //只有半颗星的时候,再次点击,变为0颗
                        key = 0;
                    }
                    this.point = key;
                }
            },

            selectRight(key) {
                if(this.edit) {
                    this.point = key;
                }
            }
        }
    }
</script>
<style scoped="scoped">
    .star-image {
        position: absolute;
        width: 0.26rem;
        height: 0.26rem;
        display: block;
    }
    .item {
        position: absolute;
        top: 0px;
        width: 0.13rem;
        height: 0.26rem;
    }
    .star-warper{
        position: relative;
        width: 100%;
        height:100%;
        display: flex;
        align-items: left;
    }
    .start-content{
        position: relative;
        display: inline-block;
        width: 0.26rem;
        height: 0.26rem;
        margin-right: 0.1rem;
    }
</style>