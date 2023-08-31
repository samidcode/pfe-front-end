import { Component, OnInit } from '@angular/core';
import * as alertFunctions from 'app/config/sweet-alerts';
import { FuseDrawerService } from '@fuse/components/drawer';
import { EleveActionComponent } from './eleve-actions/eleveAction.component';
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
        private _fuseDrawerService: FuseDrawerService
    ) {
    }
    ngOnInit(): void {
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

}
