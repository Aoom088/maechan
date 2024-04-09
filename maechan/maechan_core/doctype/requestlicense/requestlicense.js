// Copyright (c) 2023, SE and contributors
// For license information, please see license.txt

function findExtra(key, list_extra) {
    for (i = 0; i < list_extra.length; i++) {
        let x = list_extra[i];
        if (x.key == key) {
            return x;
        }
    }
    return null;
}

function findValue(key, list_extra) {

    let x = findExtra(key, list_extra)
    if (x != null) {
        return x.value
    }
    return null

}

function calAge(a, b) {
    const ms = 1000 * 60 * 60 * 24 * 365;
    const bDay = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const tDay = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.floor((tDay - bDay) / ms);
}

frappe.ui.form.on("RequestLicense", {
    refresh(frm) {
        frappe.breadcrumbs.clear();

    },after_workflow_action(frm){
        // console.log(frm.doc.request_status);
        if (frm.doc.request_status == 'รอออกใบอนุญาต'){
            // console.log("test");
            // console.log(frm.doc.request_status);
            frm.call('newLicense')
        }
    }, before_load(frm) {
        const emailUser = frappe.session.user_email
        if (frm.doc.applicant_name == null) {
            frappe.db.get_doc("UserProfile", emailUser).then(r => {
                frappe.db.get_value("Tambon",
                    filters = {
                        name_th: r.address_district,
                        amphure_th: r.address_amphur,
                        province_th: r.address_province
                    },
                    'id').then(re => {
                        frm.set_value({
                            "applicant_distict": re.message.id
                        })
                    })
                const birthday = new Date(r.birthdate)
                const today = new Date()
                const age = calAge(birthday, today);
                frm.set_value({
                    "date" : r.creation ,
                    "applicant_name": r.fullname,
                    "applicant_nationality": r.nationality,
                    "applicant_ethnicity": r.race,
                    "applicant_tel": r.tel,
                    "applicant_no": r.address_no,
                    "applicant_moo": r.address_moo,
                    "applicant_soi": r.address_soi,
                    "applicant_road": r.address_road,
                    "applicant_age": age
                });
    
            })
        }
    },
    btn_request_type(frm) {
        if (frm.doc.request_type) {
            frappe.db.get_doc("RequestLicenseType", frm.doc.request_type).then(r => {
                let RequestLicenseType = r;
                fields = []
                RequestLicenseType.details.forEach(x => {
                    let defaultValue = findValue(x.key, frm.doc.request_extra);
                    let f = {
                        label: x.key,
                        fieldname: x.key,
                        fieldtype: x.datatype,
                        options: x.options,
                        default: defaultValue
                    }
                    fields.push(f)

                })

                let d = new frappe.ui.Dialog({
                    title: 'Enter details',
                    fields: fields,
                    size: 'small', // small, large, extra-large 
                    primary_action_label: 'Submit',
                    primary_action(values) {
                        frm.doc.request_extra.forEach(x => {
                            x.value = values[x.key]
                        })
                        d.hide();
                        frm.refresh_fields("request_extra");
                    }
                });

                d.show();
            })

        }

    },
    request_type(frm) {

        frm.clear_table("request_extra")
        frm.clear_table("attachment_extra")
        frm.clear_table("checklist_extra")
        frm.clear_table("checklist_list")

        frappe.db.get_doc("RequestLicenseType", frm.doc.request_type)
            .then(r => {

                r.details.forEach(x => {

                    extraDetails = frm.add_child("request_extra");
                    extraDetails.key = x.key

                })

                frm.refresh_fields("request_extra");

                r.attachment.forEach(y => {

                    extraDetails = frm.add_child("attachment_extra");
                    extraDetails.key = y.key

                })

                frm.refresh_fields("attachment_extra");

                r.checklist_details.forEach(z => {

                    extraDetails = frm.add_child("checklist_extra");
                    extraDetails.key = z.key

                })

                frm.refresh_fields("checklist_extra");

                r.checklist.forEach(j => {

                    extraDetails = frm.add_child("checklist_list");
                    extraDetails.key = j.key
                    extraDetails.title_detail = j.title_detail
                })

                frm.refresh_fields("checklist_list");
            })
    }

});


