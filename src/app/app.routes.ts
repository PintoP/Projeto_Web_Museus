import { Routes } from '@angular/router';
import { ClienteComponent } from './cliente/cliente.component';
import { CatalogoComponent } from './catalogo/catalogo.component';
import { MuseuComponent } from './museu/museu.component';
import { PrincipalComponent } from './principal/principal.component';
import { EventoComponent } from './evento/evento.component';
import { ObrasComponent } from './obras/obras.component';

export const routes: Routes = [
    { path: '', redirectTo: '/principal', pathMatch: 'full' },
    {path: 'cliente', component: ClienteComponent},
    {path: 'principal', component: PrincipalComponent},
    {path: 'catalogo', component: CatalogoComponent},
    {path: 'evento', component: EventoComponent},
    {path: 'obras', component: ObrasComponent},
    { path: 'museu/:name/:descricao/:localizacao/:imagem/:bilhete', component: MuseuComponent }, // Atualização da rota
];
    