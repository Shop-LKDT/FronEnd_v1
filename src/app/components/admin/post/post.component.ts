import { Component, OnInit } from '@angular/core';
import $ from 'jquery';
import { User } from '../../../models/user';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Post, PostDTO } from '../../../models/post';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PostService } from '../../../services/post.service';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [NgFor, DatePipe, ReactiveFormsModule, NgIf] ,
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class PostComponent implements OnInit{
  editForm: FormGroup;
  selectedPostId: number | null = null;
  posts: Post[] = []; // Mảng chứa danh sách bài viết
  totalPosts: number = 100; // Tổng số bài viết giả định
  postsPerPage: number = 5; // Số bài viết trên mỗi trang
  currentPage: number = 1;
  totalPages: number = Math.ceil(this.totalPosts / this.postsPerPage); // Tổng số trang
  postForm: FormGroup;
  selectedPost: any = null;
  isAddModalOpen = false;
  isDeleteModalOpen = false;
  constructor(private postService: PostService, private fb: FormBuilder) {
    this.postForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      isPublished: [true, Validators.required],
    });
    this.editForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      isPublished: [true, Validators.required],
    });
  }
  ngOnInit() {
    this.getAllPosts(this.currentPage);
  }
  populateEditForm(post: Post): void {
    this.selectedPostId = post.id;
    this.editForm.patchValue({
      title: post.title,
      content: post.content,
      isPublished: true,
    });
  }
  submitEdit(): void {
    
    if (this.editForm.invalid || this.selectedPostId === null) {
      console.log(this.editForm.value);
      console.log(this.selectedPostId);
      alert('Vui lòng điền đầy đủ thông tin.');
      return;
    }

    const updatedPost: PostDTO = this.editForm.value;
    this.postService.updatePost(this.selectedPostId, updatedPost).subscribe({
      next: (response) => {
        alert('Bài viết đã được cập nhật thành công!');
        this.getAllPosts(this.currentPage); // Làm mới danh sách bài viết
        this.editForm = this.fb.group({
          title: ['', Validators.required],
          content: ['', Validators.required],
          isPublished: [true, Validators.required],
        });
        this.closeDeleteModal();
      },
      error: (err) => {
        console.error('Lỗi khi cập nhật bài viết:', err);
        alert('Không thể cập nhật bài viết. Vui lòng thử lại.');
      },
    });
  }


  getAllPosts(page: number = 1): void {
    this.postService.getAllPosts(page - 1, 10).subscribe({
      next: (response) => {
        console.log('Danh sách bài viết:', response.data);
        this.posts = response.data;
        this.totalPages = Math.ceil(response.data.length / 10);
      },
      error: (error) => {
        console.error('Error fetching posts:', error);
      },
    });
  }

  // Thêm bài viết mới
  addPost(): void {
    if (this.postForm.invalid) {
      alert('Vui lòng điền đầy đủ thông tin bài viết.');
      return;
    }

    const newPost: PostDTO = {
      title: this.postForm.value.title,
      content: this.postForm.value.content,
      isPublished: this.postForm.value.isPublished,
    };

    this.postService.createPost(newPost).subscribe({
      next: (response) => {
        alert('Thêm bài viết thành công!');
        //set các giá trị form về rỗng
        this.postForm = this.fb.group({
          title: ['', Validators.required],
          content: ['', Validators.required],
          isPublished: [true, Validators.required],
        });
        this.getAllPosts(); // Làm mới danh sách bài viết
      },
      error: (error) => {
        console.error('Lỗi khi thêm bài viết:', error);
        alert('Không thể thêm bài viết. Vui lòng thử lại.');
      },
    });
  }

  // Chuyển trang
  changePage(page: number) {
    this.currentPage = page;
    this.getAllPosts(page);
  }
  openAddModal() {
    this.isAddModalOpen = true;
  }

  closeAddModal() {
    this.isAddModalOpen = false;
  }

  openEditModal(post: any) {
    this.selectedPost = post;
    this.postForm.patchValue(post);
    this.isAddModalOpen = true;
  }

  openDeleteModal(post: any) {
    this.selectedPost = post;
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal() {
    this.selectedPost = null;
    this.isDeleteModalOpen = false;
  }

  deletePost(): void {
    if (!this.selectedPost || !this.selectedPost.id) {
      alert('Không tìm thấy bài viết để xóa.');
      return;
    }

    this.postService.deletePost(this.selectedPost.id).subscribe({
      next: () => {
        alert('Bài viết đã được xóa thành công!');
        this.getAllPosts(this.currentPage); // Làm mới danh sách bài viết
        this.closeDeleteModal(); // Đóng modal xóa
      },
      error: (err) => {
        console.error('Lỗi khi xóa bài viết:', err);
        alert('Không thể xóa bài viết. Vui lòng thử lại.');
      },
    });
  }


}
