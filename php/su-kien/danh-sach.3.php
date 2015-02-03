<?php
    $response = '';
    for ( $i=0; $i < 5; $i++ ) {
        $response .= '
            <li>
                <p><strong class="posts__cate">3. Sự kiện</strong>&nbsp;|&nbsp;<time class="posts__time">34 phút trước</time></p>
                <a href="post-details.html" title="">
                    <h3>Page 3: Cập nhật phiên bản mới</h3>
                    <img src="" title="Cập nhật phiên bản mới" alt="Cập nhật phiên bản mới" />
                </a>
            </li>
        ';
    }

    $response .= '
        <input type="hidden" id="itemTotal" value="57" />
        <input type="hidden" id="itemPerPage" value="10" />
    ';

    echo json_encode( $response );
?>