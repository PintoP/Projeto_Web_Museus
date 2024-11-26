import { Component, OnInit } from '@angular/core';
import { Firestore, collection, addDoc, getDocs, CollectionReference } from '@angular/fire/firestore';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [FooterComponent, RouterLink, RouterOutlet, CommonModule],
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.css']
})
export class CatalogoComponent implements OnInit {
  title = 'museus_pw';
  fetchedData: any[] = [];

  constructor(private firestore: Firestore, private router: Router) {}

  ngOnInit(): void {
    this.fetchDataFromFirestore();
  }

  fetchDataFromFirestore(): void {
    const museuCollection: CollectionReference = collection(this.firestore, 'museu');
    getDocs(museuCollection).then((querySnapshot) => {
      this.fetchedData = querySnapshot.docs.map(doc => ({
        nome: doc.data()['Nome'],
        descricao: doc.data()['descricao'],
        localizacao: doc.data()['localizacao'],
        imagem: doc.data()['imagem'],
        bilhete: doc.data()['bilhete']
      }));
      console.log('Fetched data from Firestore:', this.fetchedData);
    });
  }

  navigateWithName(name: string, descricao: string, localizacao: string, imagem: string,bilhete: string): void {
    this.router.navigate(['/museu', name, descricao, localizacao, imagem, bilhete]);
  }
}
