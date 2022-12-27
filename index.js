
const Joi = require("joi");
const express = require("express");
const logger = require("./middleware/logger")

const app = express();
app.use(express.json());
app.use(logger);

function validate_course(course){
    const schema = Joi.object({
        author: Joi.string().min(3).required(),
        title: Joi.string().min(3).required(),
    })

    return schema.validate(course);
}


let courses = [
    {
        id: 1,
        title: "Ultimate React Native Series",
        author: "Mosh Hamedani"
    },
    {
        id: 2,
        title: "Modern Python 3 bootcamp",
        author: "Colt Steele"
    }
]

app.get("/", (req,res)=> {
    res.status(200).send("Connection success!");
});

app.get("/api/courses", (req,res)=> {
    res.status(200).send({
        data: courses,
        error: null,
    });
})

app.get("/api/courses/:id", (req,res)=> {
    const course = courses.find(course=> course.id === parseInt(req.params.id));
    if(!course) return res.status(400).send({
        data: null,
        error: "Course with the given ID is not found."
    });

    res.status(200).send({
        data: [course],
        error: null
    });
})

app.post("/api/courses", (req,res)=> {
    const { error } = validate_course(req.body);
    if(error) res.status(400).send(error.details[0].message);

    const course = {
        id: Math.random() * 1000,
        title: req.body.title,
        author: req.body.author
    }

    courses.push(course);

    res.status(200).send({
        data: course,
        error: null,
    });
});

app.put("/api/courses/:id", (req,res)=> {
    let course = courses.find(course=> course.id === parseInt(req.params.id))
    if(!course) return res.status(404).send("Course with the given ID not found");

    const { error } = validate_course(req.body);
    if(error) res.status(400).send(error.details[0].message);

    course.author = req.body.author
    course.title = req.body.title;

    res.status(200).send({
        data: [course],
        error: null
    })
});

app.delete("/api/courses/:id", (req,res)=> {
    const _course = courses.find(course=> course.id === parseInt(req.params.id));
    if(!_course) return res.status(404).send("Course with the given ID not found.")

    // const index = courses.indexOf(course);
    // courses.splice(index,1);

    courses = courses.filter(course => course.id !== _course.id)

    res.status(200).send({
        data: [_course],
        error: null
    });
});

const port = process.env.PORT || 3000;
app.listen(port, ()=> {
    console.log("Now listening at port", port);
});