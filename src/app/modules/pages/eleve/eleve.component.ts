import { Component } from '@angular/core';
import { EleveService } from 'app/services/eleve.service';
import * as alertFunctions from 'app/config/sweet-alerts';
import { FuseDrawerService } from '@fuse/components/drawer';
import { EleveActionComponent } from './eleve-actions/eleveAction.component';
import { OnInit } from '../../../../../wsgsth delet it/@angular/core';
import { Eleve } from 'app/model/eleve';

@Component({
    selector: 'app-eleve',
    templateUrl: './eleve.component.html',
    styleUrls: ['./eleve.component.scss'],
})
export class EleveComponent implements OnInit {
    eleves: Object;
    eleveData: Eleve;
    constructor(
        private eleveService: EleveService,
        private _fuseDrawerService: FuseDrawerService
    ) {
        this.getEleve();
    }
    ngOnInit(): void {
        this.getEleve();
    }

    recentTransactionsTableColumns: string[] = [
        'image',
        'transactionId',
        'amount',
        'date',
        'name',
        'status',
        'action',
    ];

    delete(id) {
        alertFunctions.confirmText().then((result) => {
            if (result['isConfirmed']) {
                this.eleveService
                    .deletEleve(id)
                    .subscribe(() => this.getEleve());
            }
        });
    }
    getEleve() {
        this.eleveService.getData().subscribe((eleves) => {
            console.log(eleves);

            this.eleves = eleves;
        });
    }
    addEleve() {
        this.eleveService.sendDataToChild(null);
        this._fuseDrawerService.getComponent('elevDrawer').toggle();
    }
    editEleve(eleve) {
        this.eleveService.sendDataToChild(eleve);
        this._fuseDrawerService.getComponent('elevDrawer').toggle();
    }
}
