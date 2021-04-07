const fs = require('fs')
const path = require('path')

const express = require("express")
const router = express.Router()

const Validator = require("../public/javascripts/validator")
const DbContext = require("../public/javascripts/db")
const root = require("../public/javascripts/utils").root;
const getCollection = require("../public/javascripts/utils").getCollection;

const dbc = new DbContext()
const v = new Validator()
dbc.useCollection("employees.json")

router.get("/list_employees", (req, res) => {
  dbc.getAll(
    records => res.render("list_employees", { employees: records }),
    () => res.render("list_employees", { employees: null })
  )
})

router.get("/create-employee", (req, res) => {
  res.render("create_employee", {})
});

router.post("/create-employee", (req, res) => {
  if (v.isValid(req.body)) {
    dbc.saveOne(req.body, () => res.render("create_employee", { success: true }))
  } else {
    res.render("create_employee", { error: true, success: false })
  }
})

router.get('/employees/:id/delete', (req, res) => {
  dbc.deleteOne(
    req.params.id, 
    () => res.redirect('/list_employees')),
    () => res.sendStatus(500)
})


router.get("/:id/updateInfo", (req, res) => {
  const id = req.params.id

  fs.readFile(getCollection('employees.json'), (err, data) => {
    const employees = JSON.parse(data)

    const employee = employees.filter(employee => employee.id == id)[0]

    res.render("update", { employee: employee})
  })

  
});

router.get("/:id/updateInfo", (req, res) => {
  dbc.getOne(
    req.params.id,
    record => res.render("update", { employee: record }),
    () => res.sendStatus(404)
  )
})

router.post("/:id/updateInfo", (req, res) => {
  fs.readFile(getCollection('employees.json'), (err, data) => {
    if (err) res.sendStatus(500)

    const employees = JSON.parse(data)
    const employee = employees.filter(employee => employee.id == req.params.id)[0]
    const employeeIdx = employees.indexOf(employee)
    const splicedemployee = employees.splice(employeeIdx, 1)[0]
   
    splicedemployee.name = req.body.name
    splicedemployee.surname = req.body.surname
    splicedemployee.dob = req.body.dob
    splicedemployee.email = req.body.email
    splicedemployee.mobile = req.body.mobile
    splicedemployee.position = req.body.position
    employees.push(splicedemployee)

    fs.writeFile(getCollection('employees.json'), JSON.stringify(employees), err => {
      if (err) res.sendStatus(500)

      res.redirect('/')
    })   
  })
})

router.get("/:id/detailedInfo", (req, res) => {
  dbc.getOne(
    req.params.id,
    record => res.render("employee_detail", { employee: record }),
    () => res.sendStatus(404)
  )
})

module.exports = router;

