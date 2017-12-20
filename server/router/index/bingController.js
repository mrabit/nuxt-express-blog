var express = require('express');
var router = express.Router();
var Bing = require('../../model/index/bing');
var moment = require('moment');
var qiniu_model = require('../../model/qiniu');
var qiniu_config = require('../../config')['qiniu'];
var common = require('../../common');

router.get('/today', function(req, res) {
    Bing.get_image_by_time(moment().format('YYYY-MM-DD')).then(result => {
        if (result.length <= 0) {
            res.json({
                code: 404,
                message: '暂无今日图片'
            })
            return false;
        }
        res.redirect(result[0].img_url);
    }, err => {
        res.end(err);
    })
})

/***
 * 新增bing图片
 * @param string d (ps:-1:明天,0:今天,1:昨天,2:前天...........)
 * @return mixed
 */
router.get('/add_info', (req, res) => {
    var d = req.query.d || 0;
    var time = moment().subtract(d, 'days').format('YYYY-MM-DD');
    Bing.get_image_by_time(time).then(result => {
        if (result.length > 0) {
            // 数据库已存在当前值,取出;
            res.json({
                code: 200,
                success: true,
                result: result[0]
            });
            return Promise.reject({
                notRealPromiseException: true,
            });
        } else {
            return {
                idx: d,
                format: 'js',
                n: '1'
            }
        }
    }, err => {
        res.json(err);
    }).then(params => {
        return common.get_request('http://cn.bing.com/HPImageArchive.aspx', params)
    }).then(bing_data => {
        //url地址
        var urlbase = 'http://s.cn.bing.net' + bing_data.images[0]['urlbase'];
        //简介
        var copyright = bing_data.images[0]['copyright'];
        //1920地址
        var img_url = urlbase + '_1920x1080.jpg';
        //480地址
        var img_url_480 = urlbase + '_480x640.jpg';

        var qiniu = new qiniu_model();
        //需要存入七牛云的数据
        var img_url_arr = [{
                url: img_url,
                key: '1920.' + time + '.jpg'
            },
            {
                url: img_url_480,
                key: '480.' + time + '.jpg'
            }
        ]

        //需要存入数据库的数据
        var params = {
            img_real_url: img_url,
            img_time: time,
            img_title: copyright
        }
        return img_url_arr.reduce((p, next, index) => {
            return p.then(_ => {
                //存入数据到七牛云储存
                return qiniu.fetch_file_by_url(next.url, next.key).then(result => {
                    //图片保存至七牛云存储成功
                    if (!result.error) {
                        if (index == 0) {
                            //1920图片
                            params.img_url = qiniu_config['domain'] + result.key;
                        } else {
                            //480图片
                            params.img_url_480 = qiniu_config['domain'] + result.key;
                        }
                    }
                })
            })
        }, new Promise(resolve => resolve())).then(_ => {
            if (params.img_url == null || params.img_url_480 == null) {
                res.json({
                    code: 500
                })
            } else {
                return params;
            }
        })
    }).then(params => {
        Bing.insert_imgInfo(params).then(result => {
            params['id'] = result.insertId;
            res.json({
                code: 200,
                success: true,
                result: params
            });
        }, err => {
            res.json(err);
        })
    }).catch(ex => {
        if (ex.notRealPromiseException) {
            // 一切正常，只是通过 catch 方法来中止 promise chain
            // 也就是中止 promise p2 的执行
            return true;
        }
        // 真正发生异常
        return false;
    });
})

/***
 * 获取bing图片列表
 * @param int page   当前页
 * @param int length 每页条数
 * @return mixed
 */
router.get('/get_img_lists/:page/:length', function(req, res) {
    var params = {
        page: parseInt(req.params.page) || 1,
        length: parseInt(req.params.length) || 5
    };
    Bing.get_img_lists(params).then(img_list => {
        return Bing.get_img_count().then(count => {
            //取文章总页数
            var totalPage = Math.ceil(count / params.length);
            return {
                count: count,
                totalPage: totalPage,
                img_list: img_list
            }
        })
    }, err => {
        res.end(err);
    }).then(result => {
        res.json({
            code: 200,
            success: true,
            result
        });
    })
})


module.exports = router;