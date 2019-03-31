var express = require('express');
var router = express.Router();
var connection=require('../db');





router.get('/', function(req, res){
   
    if(req.user) {
            var g = 'Assistant';
        connection.query("SELECT * FROM USER WHERE id = ? AND Role = ?",[req.user, g] ,function(err1,rows1){
            if(err1 || rows1.length === 0) {
                console.log(err1);
                res.redirect('/users/login')

            }
            else {
                connection.query("SELECT * FROM ASSISTANT WHERE User_id = ?  ",req.user ,function(err2,rows2){
                    if(err2) {
                        console.log(err2);
                        res.redirect('/users/login')

                    }
                    else {
                        console.log(rows1[0]);

                        res.render('assistant/home',{'user':rows1[0], 'assistant': rows2[0],  messages: req.flash('info')});
                    }
                });
            }
        });
    }
    else{
        return res.redirect('/users/login')
    }

});



router.get('/profile', function(req, res, next) {
    if(req.user){
        connection.query("SELECT * FROM USER WHERE id = ?",req.user ,function(err1,rows1){
            if(err1) {
                console.log(err1);
                res.redirect('/users/login')

            }
            else {
                connection.query("SELECT * FROM ASSISTANT WHERE User_id = ?  ",req.user ,function(err2,rows2){
                    if(err2) {
                        console.log(err2);
                        res.redirect('/users/login')

                    }
                    else {
                        console.log(rows1[0]);
                        res.render('assistant/profile',{'user':rows1[0], 'assistant': rows2[0]});
                    }
                });
            }
        });
    }
    else {
        res.redirect('/users/login/')
    }

});


router.post('/profile', function(req, res){
    if(req.user){


        req.checkBody('phone', 'Phone Number is Not Valid').isNumeric();


        console.log('dhhhdd');
        var First_Name = req.body.fname;
        var Middle_Name = req.body.mname;
        var Last_Name = req.body.lname;
        var phone=req.body.phone;

        console.log('dhhhdd');
        connection.query("SELECT * FROM USER WHERE id = ?",req.user ,function(err1,rows1){
            if(err1) {
                console.log(err1);
                res.redirect('/users/login')

            }
            else if(rows1[0].role === 'Assistant') {
                connection.query("UPDATE ASSISTANT SET First_Name = ?, Middle_Name = ?, Last_Name = ?,Phone_Number = ? WHERE User_id = ?  ",[First_Name, Middle_Name, Last_Name,phone,req.user] ,function(err2,rows2){
                    if(err2) {
                        console.log(err2);
                        res.redirect('/users/login')

                    }
                    else {
                        console.log('dhhhdd');
                        return res.redirect('/assistant/profile/')
                    }
                });
            }
        });
    }
    else {
        res.redirect('/login/')
    }
});




router.post('/search', function(req, res, next) {

    if(req.user) {

        connection.query("SELECT * FROM USER WHERE id = ?",req.user ,function(err1,rows1){
            if(err1) {
                console.log(err1);
                res.redirect('/users/login')

            }
            else {
                connection.query("SELECT * FROM ASSISTANT WHERE User_id = ?  ",req.user ,function(err2,rows2){
                    if(err2) {
                        console.log(err2);
                        res.redirect('/users/login')

                    }
                    else {

                        connection.query(" SELECT * from (SELECT * FROM COURSE WHERE Course_Title like ?)A INNER JOIN INSTRUCTOR ON A.Instructor_id=INSTRUCTOR.Instructor_id",'%'+req.body.search+'%',function(err1,courses){
                            if(err1) {

                                console.log(err1);
                            }
                            else {
                                res.render('assistant/search/courses',{'user':rows1[0], 'assistant': rows2[0], courses : courses});
                            }
                        });

                    }
                });
            }
        });
    }
    else{
        return res.redirect('/users/login')
    }





});


router.get('/search/instructor/:id', function(req, res, next) {

    connection.query(" SELECT * from INSTRUCTOR WHERE Instructor_id= ? ",req.params.id,function(err1,row){
        if(err1) {

            console.log(err1);
        }
        else {
            res.render('assistant/search/instructor', { instructor: row[0] });
        }
    });

});

router.get('/search/course/:id', function(req, res, next) {

    if(req.user) {

        connection.query("SELECT * FROM USER WHERE id = ?",req.user ,function(err1,rows1){
            if(err1) {
                console.log(err1);
                res.redirect('/users/login')

            }
            else {
                connection.query("SELECT * FROM ASSISTANT WHERE User_id = ?  ",req.user ,function(err2,rows2){
                    if(err2) {
                        console.log(err2);
                        res.redirect('/users/login')

                    }
                    else {



                        connection.query(" SELECT * from COURSE WHERE Course_id= ? ",req.params.id,function(err1,row){
                            if(err1) {

                                console.log(err1);
                            }
                            else {
                                res.render('assistant/search/course', { course: row[0] });
                            }
                        });


                    }
                });
            }
        });
    }
    else{
        return res.redirect('/users/login')
    }








});


module.exports = router;