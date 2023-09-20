# Copyright (c) 2023, SE and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from qrcode.main import QRCode
import qrcode
import json
from io import BytesIO
import base64

from maechan.maechan_core.doctype.maechanconfig.maechanconfig import MaechanConfig

def getQrCodeBase64(type,name) :
    qrdict = {
		"type" : type,
		"name" : name
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


    


class License(Document):
    
    issuer_name : str
    issue_position : str
    license_signature_img : str
    
    def before_submit(self) :
        if self.license_signature_img == None or self.license_signature_img == "" :
           frappe.throw("ยังไม่ได้แนบลายเซ็นต์")
    
    def before_save(self) :
        
        maechanConfig : MaechanConfig = frappe.get_single("MaechanConfig") # type: ignore
        
        if self.issuer_name == None  or self.issuer_name == "":
            self.issuer_name = maechanConfig.mayor_name
        
        if self.issue_position == None  or self.issue_position == "":
            self.issue_position = maechanConfig.mayor_position
            
        if self.license_seal == None or self.license_seal == "" :
           self.license_seal = maechanConfig.seal 
        
        
    def _update_qr_code(self) :
        qrcode_base64 = 'data: image/png;base64, '+getQrCodeBase64("License",self.name)
        self.db_set('qr_code_base64',qrcode_base64)

        
    def on_update(self) :
        self._update_qr_code()

    def after_rename(self) :
        self._update_qr_code()
