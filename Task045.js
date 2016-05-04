'use strict';
var createCask = (function () {
    function MakeCask ( obj ) {
        this.obj = obj || {};
        this.min_num = obj.min_num || 3;
        this.max_num = obj.max_num || 6;
        this.load_num = obj.load_num;
        this.img_source = [];
        this.container_width = obj.container_width;
        this.default_height =  obj.default_height || 300;
    }
    MakeCask.prototype = {
        constructor : MakeCask,
        getImgSource : function (load_num) {
            var color_arr = ['0080FF','FF9334','C07ABB','BE77FF','FF7575','7B7B7B'];
            for(var i = 0; i < load_num; i++){
                var info_img={};
                var width = parseInt(Math.random() * 300 + 300);
                var height = parseInt(Math.random() * 300 + 300);
                var index = i%6;
                var str = 'http://placehold.it/' + width + 'x' + height + '/' + color_arr[index] + '/ffffff?text=' + width + 'x' +height;
                info_img.real_width = width;
                info_img.real_height = height;
                info_img.url = str;
                this.img_source.push (info_img);
            }
        },
        /**
         * 有一个情况没有考虑到：图片宽度较窄，长度很长时（图片宽高比大于行容器宽高比时）
         * @returns {Array}每一行的高度及图片个数
         */
        calculateRowParam : function () {
            var total_width = 0;
            var display_height = this.default_height;
            var display_width;
            var row_param = [];
            var counter = 0;
            for (var i = 0; i < this.img_source.length; i++ ){
                var ratio = display_height / this.img_source[i].real_height;
                total_width += this.img_source[i].real_width * ratio;
                counter ++;
                if (total_width > this.container_width && counter >= this.min_num || counter + 1 > this.max_num){
                    display_height = this.container_width/total_width * display_height;
                    row_param.push({num : counter, height : display_height - 0.01});//-0.01是考虑到除法保留结果时可能四舍五入
                    counter = 0;
                    total_width = 0;
                    display_height = this.default_height;
                }
                /*最后一排图片较少情况*/
                if( i === this.img_source.length-1 && counter != 0 ){
                    row_param.push( {num : counter, height : this.default_height} );
                }
            }
            return row_param;
        },
        /**
         * 渲染图片数组
         * @returns {*}
         */
        renderImg : function () {
            this.getImgSource( this.load_num );
            var row_param = this.calculateRowParam();
            var index = 0;
            var cask_container = document.createElement('div');
            cask_container.style.width = this.container_width + 'px';
            for ( var i = 0; i < row_param.length; i++ ){
                var line_container = document.createElement('div');
                line_container.style.height = row_param[i].height + 'px';
                for ( var j = 0; j < row_param[i].num; ++j ){
                    var img_ele = document.createElement('img');
                    img_ele.src = this.img_source[ index + j ].url;
                    line_container.appendChild(img_ele);
                }
                cask_container.appendChild (line_container);
                index += row_param[i].num;
            }
            return cask_container;
        }
    }
    return function (obj) {
        var cask_obj = new MakeCask(obj);
        return cask_obj.renderImg();
    }
})();

var test = createCask({container_width : 1000,load_num : 17});
document.getElementById('abc').appendChild(test);


