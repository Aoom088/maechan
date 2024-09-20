# Copyright (c) 2024, SE and contributors
# For license information, please see license.txt

# import frappe
from typing import List
import qrcode
import json
import base64
import datetime
import uuid

from io import BytesIO

import frappe
import frappe.utils
from frappe.model.document import Document
from frappe.types import DF
from qrcode.main import QRCode


def getQrCodeBase64(type, name):
    qrdict = {
        "type": type,
        "name": name
    }

    qrdict = json.dumps(qrdict)

    qr = QRCode(
        version=1,
        error_correction=qrcode.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(qrdict)
    qr.make(fit=True)
    img = qr.make_image()

    buffered = BytesIO()
    img.save(buffered, format="PNG")
    img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
    return img_str


def getQrCodeBase64WithUUID(type, uuid):
    qrdict = {
        "type": type,
        "uuid": uuid
    }

    qrdict = json.dumps(qrdict)

    qr = QRCode(
        version=10,
        error_correction=qrcode.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(qrdict)
    qr.make(fit=True)
    img = qr.make_image()

    buffered = BytesIO()
    img.save(buffered, format="PNG")
    img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
    return img_str


class RequestStreetcutoutTax(Document):
    # begin: auto-generated types
    # This code is auto-generated. Do not modify anything in this block.

    from typing import TYPE_CHECKING

    if TYPE_CHECKING:
        from frappe.types import DF
        from maechan.maechan_streetcutout.doctype.streetcutoutlocation.streetcutoutlocation import StreetcutoutLocation

        amended_from: DF.Link | None
        approve_status_requeststreetcutouttax: DF.Literal["\u0e2a\u0e23\u0e49\u0e32\u0e07", "\u0e23\u0e30\u0e2b\u0e27\u0e48\u0e32\u0e07\u0e01\u0e32\u0e23\u0e1e\u0e34\u0e08\u0e32\u0e23\u0e13\u0e32", "\u0e23\u0e2d\u0e0a\u0e33\u0e23\u0e30\u0e40\u0e07\u0e34\u0e19",
                                                          "\u0e23\u0e30\u0e2b\u0e27\u0e48\u0e32\u0e07\u0e01\u0e32\u0e23\u0e15\u0e23\u0e27\u0e08\u0e2a\u0e2d\u0e1a", "\u0e23\u0e2d\u0e2d\u0e19\u0e38\u0e21\u0e31\u0e15\u0e34", "\u0e2d\u0e19\u0e38\u0e21\u0e31\u0e15\u0e34", "\u0e22\u0e01\u0e40\u0e25\u0e34\u0e01", "\u0e2b\u0e21\u0e14\u0e2d\u0e32\u0e22\u0e38"]
        cost_requeststreetcutouttax: DF.Data | None
        expiration_date_requeststreetcutouttax: DF.Date | None
        payment_requeststreetcutouttax: DF.AttachImage | None
        qrpay: DF.LongText | None
        streetcutout_count_requeststreetcutouttax: DF.Data
        streetcutout_img: DF.Attach | None
        streetcutout_location: DF.TableMultiSelect[StreetcutoutLocation]
        streetcutout_size: DF.Literal["120x240 \u0e40\u0e0b\u0e19\u0e15\u0e34\u0e40\u0e21\u0e15\u0e23"]
        user_name_requeststreetcutouttax: DF.Data
        uuid: DF.Data | None
    # end: auto-generated types

    def before_submit(self):
        self._update_qr_code()

    def before_save(self):
        self._update_qr_code()

    def _update_qr_code(self):
        if (self.qrpay is None or self.qrpay == ""):

            if (self.uuid is None or self.uuid == ""):
                self.uuid = uuid.uuid4().__str__()
                self.db_set('uuid', self.uuid)
                frappe.db.commit()

            qrcode_base64 = 'data: image/png;base64, ' + \
                getQrCodeBase64WithUUID("Requeststreetcutouttax", self.uuid)
            self.db_set('qrpay', qrcode_base64)
            frappe.db.commit()

    def on_update(self):
        self._update_qr_code()

    def after_rename(self, old, new, merge=False):
        self.db_set('qrpay', None)
        self.qrpay = None
        frappe.db.commit()
        self._update_qr_code()


def get_active_workflow():

    workflows = frappe.db.get_all("Workflow",
                                  filters={
                                      'document_type': "RequestStreetcutoutTax",
                                      'is_active': True
                                  },
                                  fields='*',
                                  )

    workflow = workflows[0] if len(workflows) > 0 else None

    return workflow


def get_transitions(workflow, doc):

    transition = frappe.db.get_all("Workflow Transition",
                                   filters={
                                       'parent': workflow['workflow_name'],
                                       'allow_self_approval': True,
                                       'state': doc.workflow_state
                                   }, fields=['*'])

    return transition


@frappe.whitelist()
def load_request_streetcutouttax():
    request = frappe.form_dict
    assert 'name' in request

    name = request['name']

    # Query เพื่อดึงข้อมูล StreetcutoutLocation และ AllowedStreet
    query = """
        SELECT 
            allowed.name AS allowed_street_name,
            loc.allowed_streetcutoutlocation,
            allowed.street_allowedstreet_streetcutout
        FROM `tabStreetcutoutLocation` AS loc
        LEFT JOIN `tabAllowedStreet` AS allowed ON allowed.name = loc.allowed_streetcutoutlocation
        WHERE loc.parent = %(name)s
    """

    streetcutout_locations = frappe.db.sql(query, {
        'name': name
    }, as_dict=True)

    locations_with_streets = []
    for loc in streetcutout_locations:
        locations_with_streets.append({
            'street_allowedstreet_name': loc['allowed_street_name'],
            'street_allowedstreet': loc['street_allowedstreet_streetcutout']
        })

    request_query = """
        SELECT * FROM `tabRequestStreetcutoutTax`
        WHERE name = %(name)s
    """
    requestStreetcutoutTaxDoc = frappe.db.sql(request_query, {
        'name': name
    }, as_dict=True)

    if not requestStreetcutoutTaxDoc:
        frappe.throw(f"RequestStreetcutoutTax with name {name} not found")

    requestStreetcutoutTaxDoc = requestStreetcutoutTaxDoc[0]

    requestStreetcutoutTaxDoc['streetcutout_location'] = locations_with_streets

    workflow = get_active_workflow()

    if workflow:
        transition = get_transitions(workflow, requestStreetcutoutTaxDoc)
    else:
        transition = None

    frappe.response['workflow'] = workflow
    frappe.response['transition'] = transition
    return requestStreetcutoutTaxDoc


@frappe.whitelist()
def load_request_streetcutouttaxs():
    user = frappe.session.user

    result = frappe.db.get_all(
        "RequestStreetcutoutTax", filters={'owner': user})

    docs = [frappe.get_doc('RequestStreetcutoutTax', x.name)
            for x in result]  # type: ignore

    streetcutout = {
        x.name: frappe.db.get_all("RequestStreetcutoutTax", fields="*", filters={'name': x.name}) for x in docs
    }

    frappe.response['streetcutout'] = streetcutout

    return {'data': docs}


@frappe.whitelist()
def first_step_requeststreetcutouttax():
    req = frappe.form_dict
    assert 'request' in req

    requeststreetcutouttax = req['request']

    if 'doctype' not in requeststreetcutouttax:
        requeststreetcutouttax['doctype'] = 'RequestStreetcutoutTax'

    requeststreetcutouttaxObj: RequestStreetcutoutTax = frappe.get_doc(
        requeststreetcutouttax)  # type: ignore
    requeststreetcutouttaxObj.save()

    requeststreetcutouttaxObj.notify_update()

    frappe.response['message'] = requeststreetcutouttaxObj

@frappe.whitelist()
def update_payment():
    req = frappe.form_dict
    assert 'requeststreetcutouttax' in req
    assert 'fileresponse' in req

    requestLicenseReq = req['requeststreetcutouttax']
    fileReq = req['fileresponse']

    # ตรวจสอบว่ามี doctype อยู่ใน requestLicenseReq หรือไม่
    if 'doctype' not in requestLicenseReq:
        requestLicenseReq['doctype'] = 'RequestStreetcutoutTax'

    requestLicenseDoc: RequestStreetcutoutTax = frappe.get_doc(
        requestLicenseReq)

    requestLicenseDoc.payment_requeststreetcutouttax = fileReq['file_url']
    requestLicenseDoc.save()

    return requestLicenseDoc


@frappe.whitelist()
def clear_payment():
    req = frappe.form_dict

    assert 'requeststreetcutouttax' in req, "Missing requeststreetcutouttax"
    requestLicenseReq = req['requeststreetcutouttax']

    # ตรวจสอบและเพิ่มคีย์ 'doctype' หากไม่มีใน requestLicenseReq
    if 'doctype' not in requestLicenseReq:
        requestLicenseReq['doctype'] = 'RequestStreetcutoutTax'

    requestLicenseDoc: RequestStreetcutoutTax = frappe.get_doc(
        requestLicenseReq)  # type: ignore
    requestLicenseDoc.payment_requeststreetcutouttax = None
    requestLicenseDoc.save()

    return requestLicenseDoc


@frappe.whitelist()
def update_attachment():
    req = frappe.form_dict
    assert 'requeststreetcutouttax' in req
    assert 'fileresponse' in req
    requeststreetcutouttaxReq = req['requeststreetcutouttax']
    fileReq = req['fileresponse']

    if 'doctype' not in requeststreetcutouttaxReq:
        requeststreetcutouttaxReq['doctype'] = 'RequestStreetcutoutTax'

    requeststreetcutouttaxDoc: RequestStreetcutoutTax = frappe.get_doc(
        requeststreetcutouttaxReq)  # type: ignore
    requeststreetcutouttaxDoc.streetcutout_img = fileReq['file_url']
    requeststreetcutouttaxDoc.save()

    return requeststreetcutouttaxDoc


@frappe.whitelist()
def deleteAttachment():
    req = frappe.form_dict
    assert 'requeststreetcutouttax' in req
    attchmentReq = req['requeststreetcutouttax']

    if 'doctype' not in attchmentReq:
        attchmentReq['doctype'] = 'RequestStreetcutoutTax'

    attachmentDoc: RequestStreetcutoutTax = frappe.get_doc(
        attchmentReq)  # type: ignore
    attachmentDoc.streetcutout_img = ''
    attachmentDoc.save()

    return attachmentDoc
