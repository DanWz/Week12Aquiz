class Student {
    constructor(name) {
        this.name = name;
        this.cars = [];
    }

    addCar(make, color) {
        this.cars.push(new Car(make, color));
    }
}

class Car {
    constructor(make, color) {
        this.make = make;
        this.color = color;
    }
}

class StudentCarRecords {
    static url="https://6375c99d7e93bcb006b9b0ae.mockapi.io/api/v1/studentCars";

    static getAllStudentCarRecords() {
        return $.get(this.url);
    }

    static getStudentCarRecords(id) {
        return $.get(this.url + `/${id}`);
    }

    static createStudentCarRecord(name) {
        return $.post(this.url, name);
    }

    static updateStudentCarRecords(name) {
        return $.ajax({
            url: this.url + `/${name.id}`,
            dataType: 'json',
            data: JSON.stringify(name),
            contentType: 'application/json',
            type: 'PUT'

        });
    }

    static deleteStudentCarRecords(id) {
        return $.ajax({
            url: this.url + `/${id}`,
            type: 'DELETE'

        });
    }
}

class DOMManager {
    static StudentCarRecords;

    static getAllStudentCarRecords() {
        StudentCarRecords.getAllStudentCarRecords().then(students => this.render(students));
    }

    static createStudentCarRecord(name) {
        StudentCarRecords.createStudentCarRecord(new Student(name))
            .then(() => {
                return StudentCarRecords.getAllStudentCarRecords();
            })
            .then((students) => this.render(students));
    }

    static deleteStudentCarRecords(id) {
        StudentCarRecords.deleteStudentCarRecords(id)
            .then(() => {
                return StudentCarRecords.getAllStudentCarRecords();
            })
            .then((students) => this.render(students));
    }

    static addVehicle(id) {
        for (let student of this.students) {
            if (student.id == id) {
                student.cars.push(new Car($(`#${student.id}-vehicle-make`).val(), $(`#${student.id}-vehicle-color`).val()));
                StudentCarRecords.updateStudentCarRecords(student) 
                    .then(() => {
                        return StudentCarRecords.getAllStudentCarRecords();
                    })
                    .then((students) => this.render(students));
            }
        }
    }

    static deleteVehicle(studentId, carId) {
        for (let student of this.students) {
            if (student.id == studentId) {
                for (let car of student.cars) {
                    if (student.cars.indexOf(car) == carId) {
                        student.cars.splice(student.cars.indexOf(car), 1);
                        StudentCarRecords.updateStudentCarRecords(student)
                        .then(() => {
                            return StudentCarRecords.getAllStudentCarRecords();
                        })
                        .then((student) => this.render(student));
                    }
                }
            }
        }
    }

    static render(students) {
        this.students = students;
        $('#app').empty();
        for (let student of students) {
            $('#app').prepend(
                `<div id="${student.id}" class="card">
                    <div class="card-header">
                        <h2>${student.name} <button class="btn btn-danger" onClick="DOMManager.deleteStudentCarRecords('${student.id}')">Delete</button></h2>
                    </div>
                    <div class="card-body">
                        <div class="card">
                            <div class="row">
                                <div class="col-sm">
                                <input type="text" id="${student.id}-vehicle-make" class="form-control" placeholder="Vehicle Make">
                                </div>
                                <div class="col-sm">
                                <input type="text" id="${student.id}-vehicle-color" class="form-control" placeholder="Vehicle Color">
                                </div>
                                <div class="col-sm">
                                <button id="${student.id}-new-car" onclick="DOMManager.addVehicle('${student.id}')" class="btn btn-primary form-control">Add</button>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </div><br>`
            );
            for (let car of student.cars) {
                $(`#${student.id}`).find('.card-body').append(
                    `<p>
                        <span id="name-${car.make}"><strong>Make: </strong> ${car.make}</span>
                        <span id="name-${car.color}"><strong>Color: </strong> ${car.color}</span>
                        <button class="btn btn-danger" onclick="DOMManager.deleteVehicle('${student.id}', '${student.cars.indexOf(car)}')">Delete Vehicle</button>
                        `
                );
            }
        }
    }
}

$('#create-new-student').click(() => {
    DOMManager.createStudentCarRecord($('#new-student-name').val());
    $('#new-student-name').val('');
});


DOMManager.getAllStudentCarRecords();