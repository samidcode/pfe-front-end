import { ChangeDetectionStrategy, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Eleve } from '../eleves/eleves.types';
import { Payment } from '../payment/payment.types';
import { extend } from 'lodash';
import { DatePipe } from '@angular/common';
import { Title } from '@angular/platform-browser';

@Component({
    selector       : 'modern',
    templateUrl    : './modern.component.html',
    styleUrls:['./modern.compenent.scss'],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModernComponent implements OnInit, OnDestroy
{
    payment: Payment;
    currentDate: Date;
  title: string;

    /**
     * Constructor
     */
    constructor(
        @Inject(MAT_DIALOG_DATA) public payments: Payment,
        
    )
    {

    }
    ngOnInit(): void {
      this.payment = this.payments

        if (this.payment.objet=="Mensuel") {
          this.title = "Paiement transport scolaire " ;
        } else if (this.payment.objet=="Transport") {

                    this.title = "Paiement mensuel ";

        }else if(this.payment.objet=="Inscription"){

          this.title = "Paiement inscription ";

        }

        let pipe = new DatePipe('en-US');
            this.payment.dateDeCreation =  pipe.transform(this.payment.dateDeCreation, 'MM /dd /yyyy');

    }
    ngOnDestroy(): void {
    }

    printInvoice(sectionId) {
        const printContents = document.getElementById(sectionId)?.outerHTML;
        const printWindow = window.open('', '_blank');
        printWindow.document.open();
      
        // Fetch the CSS content from an external file
        fetch('assets/styles/invoicestyle.css', { method: 'GET' })
          .then((response) => response.text())
          .then((cssContent) => {
            console.log("print",printContents);
            console.log("css",cssContent);
            
            
            // Inject the CSS content into the <style> element
            printWindow.document.write('<html><head>');
            printWindow.document.write('<style>');
            printWindow.document.write(cssContent);
            printWindow.document.write('</style>');
            printWindow.document.write('</head><body>');
            printWindow.document.write(printContents);
            printWindow.document.write('</body></html>');
      
            // Close the document and print
            printWindow.document.close();
            printWindow.print();
      
            // Close the print window after printing
            printWindow.onafterprint = () => {
              printWindow.close();
            };
          });
      }
      











}
