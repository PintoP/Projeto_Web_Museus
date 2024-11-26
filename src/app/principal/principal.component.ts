import { Component, OnInit } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { CollectionReference, Firestore } from '@angular/fire/firestore';
import { Route, Router, RouterLink } from '@angular/router';
import { collection, doc, getDocs } from 'firebase/firestore';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [FooterComponent,CommonModule,RouterLink],
  templateUrl: './principal.component.html',
  styleUrl: './principal.component.css'
})
export class PrincipalComponent implements OnInit {
  email: string = '';
  fetchedData: any[] = [];
  constructor(private firestore: Firestore, private router: Router) {}
  ngOnInit(): void {
    this.fetchDataFromFirestore();
  }


  fetchDataFromFirestore(): void {
    const eventoCollection: CollectionReference = collection(this.firestore, 'evento');
    getDocs(eventoCollection).then((querySnapshot) => {
      this.fetchedData = querySnapshot.docs.map(doc => ({
        nome: doc.data()['Nome'],
        data: doc.data()['data'],
        museu: doc.data()['museu']
      })).filter(evento => evento.data.includes('julho'));
      console.log('Fetched data from Firestore:', this.fetchedData);
    }).catch((error) => {
      console.error('Error fetching data from Firestore:', error);
    });
}
}
