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

function formatDate(date) {
    return (
        [
            date.getFullYear(),
            padTo2Digits(date.getMonth() + 1),
            padTo2Digits(date.getDate()),
        ].join('-') +
        ' ' +
        [
            padTo2Digits(date.getHours()),
            padTo2Digits(date.getMinutes()),
            padTo2Digits(date.getSeconds()),
        ].join(':')
    );
}

function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
}

frappe.ui.form.on('License', {
    refresh(frm) {
        console.log(frm)
        // your code here
        // frm.set_df_property("license_type", "read_only", frm.is_new() ? 0 : 1);


        frm.refresh_field('approve_histories');
    },

    async before_workflow_action(frm) {
        console.log(frm)
        frappe.dom.unfreeze();

        let add_comment_states = ["Reject", "Review"]

        let select_action = frm.selected_workflow_action

        if (add_comment_states.includes(select_action)) {

            let wait = true;

            const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

            let d = new frappe.ui.Dialog({
                title: __('Enter Comment'),
                fields: [
                    {
                        label: __('Comment'),
                        fieldname: 'comment',
                        fieldtype: 'Text'
                    }
                ],
                size: 'small', // small, large, extra-large 
                primary_action_label: __('Submit'),
                primary_action: async (values) => {
                    let today = new Date()
                    let row = frm.add_child('approve_histories', {
                        workflow_action: frm.selected_workflow_action,
                        workflow_user: frappe.session.user,
                        datetime: formatDate(today),
                        comment: values.comment,

                    });
                    frm.refresh_field('approve_histories');
                    await frm.save()
                    frappe.dom.freeze();
                    wait = false
                    d.hide();
                }
            });

            d.show();



            while (wait) {
                await sleep(1000)
            }



        } else {

            let today = new Date()
            let row = frm.add_child('approve_histories', {
                workflow_action: frm.selected_workflow_action,
                workflow_user: frappe.session.user,
                datetime: formatDate(today),
                comment: '',

            });
            frappe.dom.freeze();
            frm.refresh_field('approve_histories');
            await frm.save()
        }
    },
    after_workflow_action(frm) {

    },

    btn_dialog_extra(frm) {
        console.log(frm.doc.license_type)
        if (frm.doc.license_type) {
            frappe.db.get_doc("LicenseType", frm.doc.license_type).then(r => {
                let licenseType = r;
                fields = []
                licenseType.details.forEach(x => {
                    let defaultValue = findValue(x.key, frm.doc.license_extra);
                    console.log("DEFAULT", defaultValue)
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
                        console.log(values);
                        frm.doc.license_extra.forEach(x => {
                            console.log(values, x)
                            x.value = values[x.key]
                        })
                        d.hide();
                        frm.refresh_fields("license_extra");
                    }
                });

                d.show();
            })

        }





    },
    license_type(frm) {

        frm.clear_table("license_extra")

        frappe.db.get_doc("LicenseType", frm.doc.license_type)
            .then(r => {

                r.details.forEach(x => {
                    console.log(x)

                    extraDetails = frm.add_child("license_extra");
                    extraDetails.key = x.key

                })

                frm.refresh_fields("license_extra");
            })
    }
})