<?php
    sleep(1);
    for ( $i=0; $i < 5; $i++ ) {
        echo('
            <li>
                <p><strong class="posts__cate">3. ' . ( $i%2 == 0 ? 'Sự kiện' : 'Tin tức' ) . '</strong>&nbsp;|&nbsp;<time class="posts__time">34 phút trước</time></p>
                <a href="post-details.html" title="">
                    <h3>Page 3: Cập nhật phiên bản mới</h3>' .
                    ( $i%2 == 0 ? '<img src="" title="Cập nhật phiên bản mới" alt="Cập nhật phiên bản mới" />' : '' ) . '
                </a>
            </li>
        ');
    }
?>
<input type="hidden" id="itemTotal" value="57" />
<input type="hidden" id="itemPerPage" value="10" />