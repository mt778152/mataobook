var gulp = require('gulp');
var server = require('gulp-webserver');
var url = require('url');
var fs = require('fs');
var mock = require('./mock/index');
var path = require('path');
var userdata = require('./mock/user/user').userinfo; //为数组
var sass = require('gulp-sass');
var mincss = require('gulp-clean-css');
var minjs = require('gulp-uglify');
var minhtml = require('gulp-htmlmin');
var babel = require('gulp-babel');
var autoprefixer = require('gulp-autoprefixer');
gulp.task('sass', function() {
    gulp.src('src/css/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('build/css'))
});
//压缩css
gulp.task('mincss', function() {
    gulp.src('src/css/*.css')
        .pipe(mincss())
        .pipe(autoprefixer({
            browsers: ['last 2 versions']
        }))
        .pipe(gulp.dest('build/css'))
});
//压缩js
gulp.task('minjs', function() {
    gulp.src('src/js/**/*.js')
        .pipe(babel({
            presets: 'es2015' //指定编译后的版本为es5
        }))
        .pipe(minjs())
        .pipe(gulp.dest('build/js'))
});
//压缩html
gulp.task('minhtml', function() {
    gulp.src('src/**/*.html')
        .pipe(minhtml({
            removeComments: false, //清除HTML注释
            collapseWhitespace: true, //压缩HTML
        }))
        .pipe(gulp.dest('build'))
})

gulp.task('devserver', function() {
    gulp.src('src')
        .pipe(server({
            port: 6060,
            open: true,
            host: 'localhost',
            livereload: true,
            middleware: function(req, res, next) {
                if (req.url === '/favicon.ico') {
                    return
                }
                var pathname = url.parse(req.url).pathname;
                pathname = pathname === "/" ? "/index.html" : pathname;
                if (/\/api\//.test(pathname)) {
                    if (pathname === "/api/login" || pathname === "/api/reglogin") {
                        //获取post传来的数据
                        var arr = [];
                        req.on('data', function(chunk) {
                            arr.push(chunk)
                        });
                        req.on('end', function() {
                            var data = Buffer.concat(arr).toString(); //这时的数据时字符串
                            //把数据的字符串转成对象
                            var data = require('querystring').parse(data);
                            console.log(data);
                            //判断到底是登录接口还是注册接口
                            if (pathname === "/api/login") {
                                //去数据库中查找
                                var result = userdata.some(function(v) {
                                    return v.user == data.user && v.pwd == data.pwd
                                });
                                if (result) {
                                    res.end('{"res":1,"msg":"登录成功"}')
                                } else {
                                    res.end('{"res":0,"msg":"用户名或密码错误"}')
                                }

                            } else {
                                // 这时是注册接口， 要把用户名和密码添加到数据库中 修改json文件
                                userdata.push(data);
                                var userObj = {
                                    userinfo: userdata
                                };
                                fs.writeFileSync('./mock/user/user.json', JSON.stringify(userObj));
                                res.end('{"res":1,"msg":"注册成功"}')
                            }

                        });
                        return false
                    }
                    res.end(JSON.stringify(mock(req.url)));
                } else {
                    res.end(fs.readFileSync(path.join(__dirname, 'src', pathname)))
                }
            }
        }))
});
// gulp.task('change', function() {
//     gulp.watch('src/css/*.scss', ['sass'])
// });
gulp.task('dev', ['devserver']);


gulp.task('buildserver', function() {
    gulp.src('build')
        .pipe(server({
            port: 6060,
            host: 'localhost',
            open: true,
            middleware: function(req, res, next) {
                if (req.url === "/favicon.ico") {
                    return;
                }
                var pathname = url.parse(req.url).pathname;
                pathname = pathname === '/' ? '/index.html' : pathname;
                if (/\/api\//.test(pathname)) {
                    //post
                    if (pathname === "/api/login" || pathname === "/api/reglogin") {
                        var arr = [];
                        req.on('data', function(chunk) {
                            arr.push(chunk);
                        });
                        req.on('end', function() {
                            var data = Buffer.concat(arr).toString();
                            data = require('querystring').parse(data);
                            if (pathname === "/api/login") {
                                //查找
                                var resule = userdata.some(function(v) {
                                    return v.user == data.user && v.pwd == data.pwd
                                });
                                if (resule) {
                                    res.end('{"res":1,"mes":"登录成功"}');
                                } else {
                                    res.end('{"res":0,"mes":"用户名或密码输入有误"}');
                                }
                            } else {
                                //添加
                                userdata.push(data);
                                var userObj = {
                                    userInfo: userdata
                                };
                                fs.writeFileSync('./mock/user/user.json', JSON.stringify(userObj));
                                res.end('{"res":1,"mes":"注册成功"}');
                            }
                        });
                        return false;
                    };
                    res.end(JSON.stringify(mock(req.url)));
                } else {
                    res.end(fs.readFileSync(path.join(__dirname, 'build', pathname)));
                }
            }
        }))
});
gulp.task('build', ['mincss', 'minjs', 'minhtml'])