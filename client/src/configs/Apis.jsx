import axios from "axios";

import { variables } from '../constants'

export let endpoints = {
    "register": "/users/",
    "oauth2-info": "/oauth2-info/",
    "login": "/o/token/",
    "current-user": "/users/current-user/",
    "questions": "/questions/",
    "career-categories": "/career-categories/",
    "get-survey": "/users/current-user/surveys/",
    "add-survey": "/users/current-user/add-survey/",
    "update": "/users/current-user/update/",
    "add-feedback": "/feedbacks/add-feedback/",
    "get-feedback": "/feedbacks/",
    "get-universities": "/universities/",
}

export default axios.create({
    baseURL: variables.BASE_DIR
})