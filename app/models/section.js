const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const logger = require('../utils/logger/winston-logger');

var SectionSchema = new Schema({
    sectionName: {
        type: String,
        required: true,
        unique: false
    },
    students: [{
        type: Schema.Types.ObjectId,
        required: false,
        ref: 'Student'
    }],
    schoolId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'school'
    },
    classId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'class'
    }
}, {
    collection: 'section',
    timestamps:true
});

SectionSchema.post('save', function(next) {
    var self = this;
    const Class = require('./class').Class
    let cond = {
        '_id':self.classId
    }
    let update = {
        $push : {
            'sections': self
        }
    }
    Class.updateOne(cond,update).then((school)=>{
    })
})

SectionSchema.pre('remove', function(next) {
    let self = this;
    if(self.students.length){
        const err = new Error("Students should be deleted before section deletion");
        return next(err);
    }else{
        next();
    }
    // const Subject = require('../models/subject').Subject;
    // const _ = require('lodash');
    // let query = {
    //     '_id': {
    //         '$in': this.subjects
    //     }
    // } // or simply say find subject on {sectionId : this._id}

    // Subject.find(query).then(subjects => {
    //         if (subjects) {
    //             var promises = [];
    //             _.forEach(subjects, function(subject) {
    //                 promises.push(subject.remove());
    //             })
    //             Promise.all(promises).then(x => {
    //                     next();
    //                 })
    //                 .catch(e => {
    //                     next(e);
    //                 })
    //         } else {
    //             next();
    //         }
    //     })
    //     .catch(e => {
    //         next(e);
    //     })
});

SectionSchema.post('remove', function(next) {
    var self = this;
    const Class = require('./class').Class
    let cond = {
        '_id':self.schoolId
    }
    let update = {
        $pull : {
            'sections': self._id
        }
    }
    Class.updateOne(cond,update).then((result)=>{
    })
})

var Section = mongoose.model('Section', SectionSchema)
module.exports = {
    Section: Section,
    SectionSchema: SectionSchema
}