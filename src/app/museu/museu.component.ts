import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Firestore, collection, getDocs, CollectionReference, query, limit, where } from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../footer/footer.component';
import { addDoc } from 'firebase/firestore';
import { UserService } from '../user.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-museu',
  standalone: true,
  imports: [CommonModule, FooterComponent, FormsModule],
  templateUrl: './museu.component.html',
  styleUrls: ['./museu.component.css']
})
export class MuseuComponent implements OnInit {
  name: string = '';
  descricao: string = '';
  bilhete: string = '';
  localizacao: SafeResourceUrl = '';
  fetchedData: any[] = [];
  fetchedObras: any[] = [];
  selectedRating: number | null = null;

  constructor(private route: ActivatedRoute, private sanitizer: DomSanitizer, private firestore: Firestore, private userService: UserService) { }

  ngOnInit() {
    this.name = this.route.snapshot.paramMap.get('name') || '';
    this.descricao = this.route.snapshot.paramMap.get('descricao') || '';
    this.bilhete = this.route.snapshot.paramMap.get('bilhete') || '';
    const localizacaoParam = this.route.snapshot.paramMap.get('localizacao') || '';
    this.localizacao = this.sanitizer.bypassSecurityTrustResourceUrl(localizacaoParam);
    this.fetchDataFromFirestore();
    this.fetchObrasFromFirestore();
  }

  fetchDataFromFirestore(): void {
    const eventoCollection: CollectionReference = collection(this.firestore, 'evento');
    const eventoQuery = query(eventoCollection, limit(2));

    getDocs(eventoQuery).then((querySnapshot) => {
      this.fetchedData = querySnapshot.docs.map(doc => ({
        nome: doc.data()['Nome'],
        data: doc.data()['data'],
        museu: doc.data()['museu']
      })).filter(evento => evento.museu.includes(this.name));
      console.log('Fetched data from Firestore:', this.fetchedData);
    }).catch((error) => {
      console.error('Error fetching data from Firestore:', error);
    });
  }

  fetchObrasFromFirestore(): void {
    const obraCollection: CollectionReference = collection(this.firestore, 'obra');
    const obraQuery = query(obraCollection, where('museu', '==', this.name));

    getDocs(obraQuery).then((querySnapshot) => {
      this.fetchedObras = querySnapshot.docs.map(doc => ({
        nome: doc.data()['Nome'],
        museu: doc.data()['museu'],
        autor: doc.data()['autor'],
        imagem: doc.data()['imagem']
      }));
      console.log('Fetched obras from Firestore:', this.fetchedObras);
    }).catch((error) => {
      console.error('Error fetching obras from Firestore:', error);
    });
  }

  submitRating(rating: number | null, museuNome: string): void {
    if (rating === null) {
      alert('Selecione uma avaliação');
      return;
    }

    const userEmail = this.userService.getEmail();
    if (!userEmail) {
      alert('Faça login primeiro');
      return;
    }

    const ratingCollection = collection(this.firestore, 'rating');
    addDoc(ratingCollection, {
      userEmail: userEmail,
      stars: rating,
      museuNome: museuNome
    }).then(() => {
      alert('Avaliação enviada com sucesso');
    }).catch((error) => {
      console.error('Erro ao enviar avaliação:', error);
      alert('Erro ao enviar avaliação');
    });
  }

  openTicketLink(): void {
    if (this.bilhete) {
      window.open(this.bilhete, '_blank');
    } else {
      alert('Link do bilhete não disponível.');
    }
  }
}
