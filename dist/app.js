"use strict";
// Project Type
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ProjectStatus;
(function (ProjectStatus) {
    ProjectStatus[ProjectStatus["Active"] = 0] = "Active";
    ProjectStatus[ProjectStatus["Finished"] = 1] = "Finished";
})(ProjectStatus || (ProjectStatus = {}));
var Project = /** @class */ (function () {
    function Project(id, title, description, numberOfPeople, projectStatus) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.numberOfPeople = numberOfPeople;
        this.projectStatus = projectStatus;
    }
    return Project;
}());
var ProjectState = /** @class */ (function () {
    function ProjectState() {
        this.listener = [];
        this.projects = [];
    }
    ProjectState.getInstance = function () {
        if (this.instance)
            return this.instance;
        this.instance = new ProjectState();
        return this.instance;
    };
    ProjectState.prototype.addListener = function (listnenerFn) {
        this.listener.push(listnenerFn);
    };
    ProjectState.prototype.addProject = function (title, description, numberOfPeople) {
        var newProject = new Project(Math.random().toString(), title, description, numberOfPeople, ProjectStatus.Active);
        this.projects.push(newProject);
        for (var _i = 0, _a = this.listener; _i < _a.length; _i++) {
            var listnenerFn = _a[_i];
            listnenerFn(this.projects.slice());
        }
    };
    return ProjectState;
}());
// Initiate single instance of ProjectState class (Singleton)
var projectState = ProjectState.getInstance();
function validate(validateableInput) {
    var isValid = true;
    if (validateableInput.required) {
        isValid = isValid && validateableInput.value.toString().trim().length !== 0;
    }
    if (validateableInput.minLength != null &&
        typeof validateableInput.value === "string") {
        isValid =
            isValid && validateableInput.value.length >= validateableInput.minLength;
    }
    if (validateableInput.maxLength != null &&
        typeof validateableInput.value === "string") {
        isValid =
            isValid && validateableInput.value.length <= validateableInput.maxLength;
    }
    if (validateableInput.min != null &&
        typeof validateableInput.value === "number") {
        isValid = isValid && validateableInput.value >= validateableInput.min;
    }
    if (validateableInput.max != null &&
        typeof validateableInput.value === "number") {
        isValid = isValid && validateableInput.value <= validateableInput.max;
    }
    return isValid;
}
// autobind decorator
function Autobind(_, _2, descriptor) {
    var originalMethod = descriptor.value;
    var adjustedDescriptor = {
        configurable: true,
        get: function () {
            var boundFunction = originalMethod.bind(this);
            return boundFunction;
        },
    };
    return adjustedDescriptor;
}
// ProjectList Class
var ProjectList = /** @class */ (function () {
    function ProjectList(type) {
        var _this = this;
        this.type = type;
        this.templateElement = document.getElementById("project-list");
        this.hostElement = document.getElementById("app");
        this.assignedProjects = [];
        var importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild;
        this.element.id = "".concat(this.type, "-projects");
        projectState.addListener(function (projects) {
            var relevantProjects = projects.filter(function (project) {
                if (_this.type === "active") {
                    return project.projectStatus === ProjectStatus.Active;
                }
                else {
                    return project.projectStatus === ProjectStatus.Finished;
                }
            });
            _this.assignedProjects = relevantProjects;
            _this.renderProjects();
        });
        this.attach();
        this.renderContent();
    }
    ProjectList.prototype.renderProjects = function () {
        var listElement = document.getElementById("".concat(this.type, "-projects-list"));
        listElement.innerHTML = "";
        for (var _i = 0, _a = this.assignedProjects; _i < _a.length; _i++) {
            var projectItem = _a[_i];
            var listItem = document.createElement("li");
            listItem.textContent = projectItem.title;
            listElement === null || listElement === void 0 ? void 0 : listElement.appendChild(listItem);
        }
    };
    ProjectList.prototype.attach = function () {
        this.hostElement.insertAdjacentElement("beforeend", this.element);
    };
    ProjectList.prototype.renderContent = function () {
        var listId = "".concat(this.type, "-projects-list");
        this.element.querySelector("ul").id = listId;
        this.element.querySelector("h2").textContent =
            this.type.toUpperCase() + " PROJECTS";
    };
    return ProjectList;
}());
//ProjectInput Class
var ProjectInput = /** @class */ (function () {
    function ProjectInput() {
        this.templateElement = document.getElementById("project-input");
        this.hostElement = document.getElementById("app");
        var importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild;
        this.element.id = "user-input";
        this.titleInputElement = this.element.querySelector("#title");
        this.descriptionInputElement = this.element.querySelector("#description");
        this.peopleInputElement = this.element.querySelector("#people");
        this.configure();
        this.attach();
    }
    ProjectInput.prototype.gatherUserInput = function () {
        var enteredTitle = this.titleInputElement.value;
        var enteredDescription = this.descriptionInputElement.value;
        var enteredPeople = this.peopleInputElement.value;
        var titleValidatable = {
            value: enteredTitle,
            required: true,
        };
        var descriptionValidatable = {
            value: enteredDescription,
            required: true,
            minLength: 5,
        };
        var peopleValidatable = {
            value: +enteredPeople,
            required: true,
            min: 1,
            max: 5,
        };
        if (!validate(titleValidatable) ||
            !validate(descriptionValidatable) ||
            !validate(peopleValidatable)) {
            alert("Invalid Input!");
            return;
        }
        else
            return [
                enteredTitle.trim(),
                enteredDescription.trim(),
                +enteredPeople.trim(),
            ];
    };
    ProjectInput.prototype.clearInputs = function () {
        this.titleInputElement.value = "";
        this.descriptionInputElement.value = "";
        this.peopleInputElement.value = "";
    };
    ProjectInput.prototype.submitHandler = function (event) {
        event.preventDefault();
        var userInput = this.gatherUserInput();
        if (Array.isArray(userInput)) {
            var title = userInput[0], desc = userInput[1], people = userInput[2];
            projectState.addProject(title, desc, people);
        }
        this.clearInputs();
    };
    ProjectInput.prototype.configure = function () {
        this.element.addEventListener("submit", this.submitHandler);
    };
    ProjectInput.prototype.attach = function () {
        this.hostElement.insertAdjacentElement("afterbegin", this.element);
    };
    __decorate([
        Autobind
    ], ProjectInput.prototype, "submitHandler", null);
    return ProjectInput;
}());
var projectInput = new ProjectInput();
var activePojectList = new ProjectList("active");
var finishedPojectList = new ProjectList("finished");
