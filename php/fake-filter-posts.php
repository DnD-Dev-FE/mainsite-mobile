<?php
    sleep(2);
    $postData = json_decode( file_get_contents('php://input') );
    switch ( $postData->cate ) {
        case 'all':
            for ( $i=0; $i < 5; $i++ ) {
                echo('
                    <li>
                        <p><strong class="posts__cate">' . ( $i%2 == 0 ? 'Sự kiện' : 'Tin tức' ) . '</strong>&nbsp;|&nbsp;<time class="posts__time">34 phút trước</time></p>
                        <a href="#" title="">
                            <h3>Cập nhật phiên bản mới</h3>
                            <img src="" title="Cập nhật phiên bản mới" alt="Cập nhật phiên bản mới" />
                        </a>
                    </li>
                ');
            }
            break;
        case 'news':
            for ( $i=0; $i < 5; $i++ ) {
                echo('
                    <li>
                        <p><strong class="posts__cate">Tin tức</strong>&nbsp;|&nbsp;<time class="posts__time">34 phút trước</time></p>
                        <a href="#" title="">
                            <h3>Lưu ý về vấn đề nạp Xu vào 08:00 sáng 08.01.2015</h3>
                        </a>
                    </li>
                ');
            }
            break;
        case 'events':
            for ( $i=0; $i < 5; $i++ ) {
                echo('
                    <li>
                        <p><strong class="posts__cate">Sự kiện</strong>&nbsp;|&nbsp;<time class="posts__time">34 phút trước</time></p>
                        <a href="#" title="">
                            <h3>Cập nhật phiên bản mới</h3>
                            <img src="" title="Cập nhật phiên bản mới" alt="Cập nhật phiên bản mới" />
                        </a>
                    </li>
                ');
            }
            break;
    }
?>