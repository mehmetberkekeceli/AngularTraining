import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-comment-system',
  templateUrl: './comment-system.component.html',
  styleUrls: ['./comment-system.component.css']
})
export class CommentSystemComponent {
  @Input() blogId!: number;
}
