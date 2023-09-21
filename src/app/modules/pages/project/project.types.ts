export class PaymentStatistics {
    yesterday: PaymentDetails;
    today: PaymentDetails;
    DayAgo: PaymentDetails;
  }
  
  export class PaymentDetails {
    elevePayentYestrday?: number;
    sizeOfPaymentYestrday?: number;
    totaleOfInscriptionYestrday?: number;
    elevePayentToday?: number;
    totaleOfInscriptionToday?: number;
    sizeOfPaymentToday?: number;
    elevePayentDayAgo?: number;
    sizeOfPaymentDayAgo?: number;
    totaleOfInscriptionDayAgo?: number;
  }