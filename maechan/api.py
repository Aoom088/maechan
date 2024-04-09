import json
import base64
from io import BytesIO

import frappe
import frappe.utils
import frappe.utils.logger
from frappe.utils.password import update_password as _update_password
from frappe.utils.oauth import login_oauth_user, login_via_oauth2_id_token, get_info_via_oauth

from maechan.maechan_core.doctype.license.license import License


frappe.utils.logger.set_log_level("DEBUG")
logger = frappe.logger("maechan.api", allow_site=True, file_count=50)


@frappe.whitelist(allow_guest=True)
def hello():
    frappe.response['message'] = "Hello from code"


@frappe.whitelist(allow_guest=True)
def land_chart():

    request = frappe.form_dict

    if "district_id" in request:
        district_id = request['district_id']
        lands = frappe.db.get_all(
            "Land", filters={"district_id": district_id}, fields='*')
    else:
        lands = frappe.db.get_all("Land", fields='*')

    frappe.response['message'] = lands
    # frappe.response['request'] = request


@frappe.whitelist(allow_guest=True)
def house_chart():
    request = frappe.form_dict

    if "district_id" in request:
        district_id = request['district_id']
        houses = frappe.db.get_all(
            "House", filters={"district_id": district_id}, fields='*')
    else:
        houses = frappe.db.get_all("House", fields='*')

    frappe.response['message'] = houses
    # frappe.response['request'] = request


@frappe.whitelist(allow_guest=True)
def license_preivew() :
    request = frappe.form_dict
    if request['type'] == "License" :
        
        if 'name' in request :
            doc_name = request['name']
            doc : License = frappe.get_doc("License", doc_name) # type: ignore
            
            from frappe.core.doctype.file.utils import get_local_image
            
            if doc.license_signature_img :
                localImg = get_local_image(doc.license_signature_img)
                buffered = BytesIO()
                localImg[0].save(buffered, format="png")
                img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
                
                doc.license_signature_img = 'data: image/png;base64, ' +  img_str # type: ignore
            
            
            content = frappe.render_template('templates/license/licensedefault.html', {'doc':doc})
            content = f"<html>{content}</html>"
            return content
        elif 'uuid' in request : 
            from frappe.query_builder import DocType
            LicenseDocType = frappe.qb.DocType('License')

            q =(frappe.qb.from_(LicenseDocType)
                .limit(1)
                .select("*")
                .where(LicenseDocType.uuid == request['uuid']))
            
            result = q.run(as_dict=True)
            if(len(result) == 1) : 
                
                doc : License = frappe.get_doc("License", result[0]['name']) # type: ignore

                from frappe.core.doctype.file.utils import get_local_image
                
                if doc.license_signature_img :
                    localImg = get_local_image(doc.license_signature_img)
                    buffered = BytesIO()
                    localImg[0].save(buffered, format="png")
                    img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
                    
                    doc.license_signature_img = 'data: image/png;base64, ' +  img_str # type: ignore
                
                
                content = frappe.render_template('templates/license/licensedefault.html', {'doc':doc})
                content = f"<html>{content}</html>"
                return content
                
            return "Not found"

            

        
    frappe.throw("Request is invalid")
    
    
@frappe.whitelist(allow_guest=True)
def login_via_line(code: str, state: str):
    provider = "line"
    decoder=decoder_compat
    info = get_info_via_oauth(provider, code, decoder, id_token=True)
    logger.debug("TEST")
    logger.debug(info)
    login_oauth_user(info, provider=provider, state=state)

def decoder_compat(b):
    # https://github.com/litl/rauth/issues/145#issuecomment-31199471
    return json.loads(bytes(b).decode("utf-8"))



#create api for register
@frappe.whitelist(allow_guest=True)
def sign_up(email: str, full_name: str, redirect_to: str) -> tuple[int, str]:
    if is_signup_disabled():
        frappe.throw(_("Sign Up is disabled"), title=_("Not Allowed"))

    user = frappe.db.get("User", {"email": email})
    if user:
        if user.enabled:
            return 0, _("Already Registered")
        else:
            return 0, _("Registered but disabled")
    else:
        if frappe.db.get_creation_count("User", 60) > 300:
            frappe.respond_as_web_page(
                _("Temporarily Disabled"),
                _(
                    "Too many users signed up recently, so the registration is disabled. Please try back in an hour"
                ),
                http_status_code=429,
            )

        from frappe.utils import random_string
        
        user = frappe.get_doc(
            {
                "doctype": "User",
                "email": email,
                "first_name": escape_html(full_name),
                "enabled": 1,
                "new_password": random_string(10),
                "user_type": "Website User",
            }
        )
        
        user.flags.ignore_permissions = True
        user.flags.ignore_password_policy = True
        user.insert()
        
        # set default signup role as per Portal Settings
        default_role = frappe.db.get_single_value("Portal Settings", "default_role")
        if default_role:
            user.add_roles(default_role)

        if redirect_to:
            frappe.cache.hset("redirect_after_login", user.name, redirect_to)

        if user.flags.email_sent:
            return 1, _("Please check your email for verification")
        else:
            return 2, _("Please ask your administrator to verify your sign-up")
        
    
@frappe.whitelist(allow_guest=True)
def register() :
    request = frappe.form_dict
    
    profileUser = frappe.db.get("User", {"email": request.email})
    if profileUser:
        return 0
    else :
        profileUser = frappe.get_doc(
        {
            "doctype": "UserProfile",
            "fullname": request.fullname,
            "nationality": request.nationality,
            "race": request.race,
            "birthdate": request.birthdate,
            "tel": request.tel,
            "email": request.email,
            "address_no": request.address_no,
            "address_moo": request.address_moo,
            "address_soi": request.address_soi,
            "address_road": request.address_road,
            "address_district": request.address_district,
            "address_amphur": request.address_amphur,
            "address_province": request.address_province,
            }
        )
        
        profileUser.flags.ignore_permissions = True
        profileUser.flags.ignore_password_policy = True
        profileUser.insert()

        return 1

@frappe.whitelist(allow_guest=True)
def createUser() :
    request = frappe.form_dict
    
    user = frappe.db.get("User", {"email": request.email})
    if user:
        if user.enabled:
            return "Already Registered"
        else:
            return "Registered but disabled"
    else :
        from frappe.utils import random_string    
        user = frappe.get_doc(
                {
                    "doctype": "User",
                    "email": request.email,
                    "first_name": request.fullname,
                    "enabled": 1,
                    "new_password": request.pwd,
                    "user_type": "Website User",
                }
            )
            
        user.flags.ignore_permissions = True
        user.flags.ignore_password_policy = True
        user.insert()
        
        default_role = frappe.db.get_single_value("Portal Settings", "default_role")
        if default_role:
            user.add_roles(default_role)
        return "Please check your email for verification"

@frappe.whitelist(allow_guest=True)
def checkEmail() :
    request = frappe.form_dict    
    email = frappe.db.get("User", {"email": request.email})
    return  email

@frappe.whitelist(allow_guest=True)
def setOwner():
    request = frappe.form_dict
    sql_query = "UPDATE `tabUserProfile`SET owner='"+request.email+"' WHERE name='"+request.email+"'"
    frappe.db.sql(sql_query)
    frappe.db.commit()

@frappe.whitelist(allow_guest=True)
def checkTel() :
    request = frappe.form_dict    
    tel = frappe.db.get("UserProfile", {"tel": request.tel})
    return  tel