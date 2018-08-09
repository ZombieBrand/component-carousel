function Carousel($ct) {
  this.init($ct);
  this.bind();
}
Carousel.prototype = {
  init: function($ct) {
    this.$ct = $ct;
    this.$imgCt = this.$ct.find(".img-ct");
    this.$imgs = this.$ct.find(".img-ct>li");
    this.$preBtn = this.$ct.find("#pre");
    this.$nextBtn = this.$ct.find("#next");
    this.$bullet = this.$ct.find(".bullet>li");
    // 获取单个img宽度
    this.imgWidth = this.$imgs.width();
    // 获取html初始化img数量
    this.imgCount = this.$imgs.length;
    // 滚动下标默认是原html中第一张显示图片
    this.index = 0;
    // 动画是否执行中标记
    this.isAnimate = false;
    // 复制原html中第一个图片插入到html中最后位置
    this.$imgCt.append(this.$imgs.first().clone());
    // 复制原html中最后一个图片插入到html中第一个位置
    this.$imgCt.prepend(this.$imgs.last().clone());
    // 初始化img-container的宽度（根据不同数量的图片设置对应的宽度）
    this.$imgCt.width((this.imgCount + 2) * this.$imgWidth);
    // 初始化img-container的图片显示位置（默认是处理后第二张图片）
    this.$imgCt.css("left", -this.imgWidth);
    /**
     * 现在处理后html中的图片顺序是第一张是原Html中最后一张的复制
     * 从第二张开始是原html中第一张显示图片
     * 最后一张也就是原html中第一张图片复制
     * 现在html中有6张图片
     */
  },
  bind: function() {
    let _this = this;
    // 点击向左滚动点击事件
    this.$preBtn.on("click", e => {
      e.preventDefault();
      console.log("pre");
      // 默认滚动位置1张图片宽度
      this.playPre.call(this, 1);
    });
    // 点击向右滚动点击事件
    this.$nextBtn.on("click", e => {
      e.preventDefault();
      console.log("next");
      // 默认滚动位置1张图片宽度
      this.playNext.call(this, 1);
    });
    // 底部footerBar点击事件
    this.$bullet.on("click", function(e) {
      e.preventDefault();
      let bulletIndex = $(this).index();
      // 图片显示下标大于当前点击下标
      if (_this.index > bulletIndex) {
        _this.playPre(_this.index - bulletIndex);
      } else {
        _this.playNext(bulletIndex - _this.index);
      }
    });
    this.$imgCt.on("mouseenter", () => {
      this.stopPlay();
    });
    this.$imgCt.on("mouseleave", () => {
      this.stopPlay();
      this.autoPlay();
    });
    this.$imgCt.trigger("mouseleave");
  },
  playPre: function(len) {
    console.log("playPre");
    if (this.isAnimate) return;
    this.isAnimate = true;
    this.$imgCt.animate(
      {
        left: `+=${this.imgWidth * len}`
      },
      () => {
        // 累计index下标值
        this.index -= len;
        console.log(this.index);
        // 点击切换footerBar:active
        this.bulletClass();
        this.isAnimate = false;
        //1/6的图片时候设置视口显示left=原Html中最后一张图片位置
        if (this.index === -1) {
          this.$imgCt.css("left", -this.imgWidth * this.imgCount);
          this.index = 3;
          this.bulletClass();
        }
      }
    );
  },
  playNext: function(len) {
    console.log("playNext");
    console.log(this.isAnimate);
    if (this.isAnimate) return;
    this.isAnimate = true;
    this.$imgCt.animate(
      {
        left: `-=${this.imgWidth * len}`
      },
      () => {
        // 累计index下标值
        this.index += len;
        console.log(this.index);
        // 点击切换footerBar:active
        this.bulletClass();
        this.isAnimate = false;
        //1/6的图片时候设置视口显示left=原Html中第一张图片位置
        if (this.index === 4) {
          this.$imgCt.css("left", -this.imgWidth);
          this.index = 0;
          this.bulletClass();
          console.log(this.isAnimate);
        }
      }
    );
  },
  bulletClass: function() {
    this.$bullet
      .eq(this.index)
      .addClass("active")
      .siblings()
      .removeClass("active");
  },
  autoPlay: function() {
    let _this = this;
    this.timer = setInterval(function() {
      _this.playNext(1);
    }, 2000);
  },
  stopPlay: function() {
    clearInterval(this.timer);
  }
};
new Carousel($(".carousel").eq(0));
new Carousel($(".carousel").eq(1));
